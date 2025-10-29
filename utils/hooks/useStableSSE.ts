import { useEffect, useRef } from 'react';

export function useStableSSE<E extends { type: string }>(
  url: string,
  handlers: {
    onOpen?: () => void;
    onMessage?: (ev: MessageEvent) => void;
    onNamed?: {
      [K in E['type']]?: (
        data: Extract<E, { type: K }>,
        ev: MessageEvent,
      ) => void;
    };
    onError?: (err: any) => void;
    onDone?: () => void;
  },
  opts?: {
    autoReconnect?: boolean;
    maxRetries?: number;
    backoffBaseMs?: number;
    withCredentials?: boolean;
  },
) {
  const esRef = useRef<EventSource | null>(null);
  const retryRef = useRef(0);
  const closedRef = useRef(false);

  useEffect(() => {
    if (!url) return;
    closedRef.current = false;

    const autoReconnect = opts?.autoReconnect ?? true;
    const maxRetries = opts?.maxRetries ?? 5;
    const backoffBaseMs = opts?.backoffBaseMs ?? 400;

    // 핸들러에 선언된 키를 그대로 리스너로 등록(확장 자동 반영)
    const namedKeys = Object.keys(handlers.onNamed ?? {}) as Array<E['type']>;
    const added: Array<{ key: string; fn: (e: MessageEvent) => void }> = [];

    const connect = () => {
      if (closedRef.current) return;

      const es = new EventSource(url, {
        withCredentials: !!opts?.withCredentials,
      } as EventSourceInit);
      esRef.current = es;

      es.onopen = () => {
        retryRef.current = 0;
        handlers.onOpen?.();
      };

      // 기본 message (event 미지정, data에 {type} 포함)
      es.onmessage = (e) => {
        handlers.onMessage?.(e);
        let payload: any = e.data;
        try {
          payload = JSON.parse(payload); // 1차
          if (typeof payload === 'string') payload = JSON.parse(payload); // 2차(이중 stringify 방어)
        } catch {}
        const t = payload?.type as E['type'] | undefined;
        if (t && handlers.onNamed?.[t]) {
          handlers.onNamed[t]?.(payload, e);
        }
      };

      // 네임드 이벤트 (server가 event: <name>로 보낼 때)
      namedKeys.forEach((key) => {
        const fn = (e: MessageEvent) => {
          let payload: any = e.data;
          try {
            payload = JSON.parse(payload);
            if (typeof payload === 'string') payload = JSON.parse(payload);
          } catch {}
          // 서버가 event: done 으로 보낼 때 completed로 매핑
          const mappedKey =
            key === ('completed' as E['type']) && (e as any).type === 'done'
              ? ('completed' as E['type'])
              : ((e as any).type as E['type']) || key;

          const data = {
            ...(typeof payload === 'object' ? payload : { data: payload }),
            type: mappedKey,
          } as E;

          handlers.onNamed?.[mappedKey]?.(data as any, e);
        };
        es.addEventListener(key as string, fn);

        added.push({ key: key as string, fn });
      });

      // 에러/재시도
      es.onerror = (err) => {
        handlers.onError?.(err);
        es.close();
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
      const es = esRef.current;
      if (es) {
        added.forEach(({ key, fn }) => es.removeEventListener(key, fn));
        es.close();
      }
      esRef.current = null;
    };
  }, [url]);
}
