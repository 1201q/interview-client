import { useEffect, useRef } from 'react';

type ExtendedType = { type: string };

type NamedHandler<E extends ExtendedType> = {
  [K in E['type']]?: (data: Extract<E, { type: K }>, ev: MessageEvent) => void;
};

type Handlers<E extends ExtendedType> = {
  onOpen?: () => void;
  onMessage?: (ev: MessageEvent) => void;
  onNamed?: NamedHandler<E>;
  onError?: (err: any) => void;
  onDone?: () => void;
};

export function useStableSSE<E extends ExtendedType>(
  url: string,
  handlers: Handlers<E>,

  opts?: {
    autoReconnect?: boolean;
    maxRetries?: number;
    backoffBaseMs?: number;
  },
) {
  const startedRef = useRef(false);
  const esRef = useRef<EventSource | null>(null);
  const retryRef = useRef(0);
  const closedRef = useRef(false);

  useEffect(() => {
    if (!url || startedRef.current) return;

    startedRef.current = true;
    closedRef.current = false;

    const autoReconnect = opts?.autoReconnect ?? true;
    const maxRetries = opts?.maxRetries ?? 5;
    const backoffBaseMs = opts?.backoffBaseMs ?? 400;

    const connect = () => {
      if (closedRef.current) return;

      const ess = new EventSource(url);

      esRef.current = ess;

      ess.onopen = () => {
        retryRef.current = 0;
        handlers.onOpen?.();
      };

      ess.onmessage = (e) => {
        handlers.onMessage?.(e);

        let parsed: unknown = e.data;

        try {
          parsed = JSON.parse(e.data as string);
        } catch {}

        const obj = parsed as Partial<E> | undefined;
        const typekey =
          obj && typeof obj === 'object' ? (obj as any).type : undefined;

        if (typekey && handlers.onNamed && typekey in handlers.onNamed) {
          handlers.onNamed[typekey as E['type']]?.(obj as any, e);

          if (typekey === 'done') {
            handlers.onDone?.();
            ess.close();
            esRef.current = null;
            closedRef.current = true;
          }
        }
      };

      ess.onerror = (error) => {
        handlers.onError?.(error);

        ess.close();
        esRef.current = null;

        if (!autoReconnect || closedRef.current) return;
        if (retryRef.current >= maxRetries) return;

        const t = backoffBaseMs * Math.pow(2, retryRef.current++);

        setTimeout(connect, t);
      };
    };

    connect();

    return () => {
      closedRef.current = true;
      esRef.current?.close();
      esRef.current = null;
    };
  }, [url]);
}
