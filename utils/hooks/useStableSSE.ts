import { useEffect, useRef } from 'react';

type Handlers = {
  onOpen?: () => void;
  onMessage?: (ev: MessageEvent) => void;
  onNamed?: Record<string, (data: any, ev: MessageEvent) => void>;
  onError?: (err: any) => void;
  onDone?: () => void;
};

export const useStableSSE = (
  url: string,
  handlers: Handlers,

  opts?: {
    autoReconnect?: boolean;
    maxRetries?: number;
    backoffBaseMs?: number;
  },
) => {
  const startedRef = useRef(false);
  const esRef = useRef<EventSource | null>(null);
  const retryRef = useRef(0);
  const closedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;

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

      if (handlers.onNamed) {
        for (const [eventName, fn] of Object.entries(handlers.onNamed)) {
          const listener = (e: MessageEvent) => {
            let data: any = e.data;
            try {
              data = JSON.parse(e.data);
            } catch {}

            fn(data, e);

            if (eventName === 'done') {
              handlers.onDone?.();
              ess.close();
              esRef.current = null;
              closedRef.current = true;
            }
          };
          ess.addEventListener(eventName, listener as any);
        }
      }
    };

    connect();

    return () => {
      closedRef.current = true;
      esRef.current?.close();
      esRef.current = null;
    };
  }, [url]);
};
