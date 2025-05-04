import { useEffect, useRef, useState } from 'react';

export const useStableTrueCallback = (
  state: boolean,
  durationMs: number,
  onStableTrue: () => void,
  enabled: boolean = true,
): number => {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const calledRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setProgress(0);
      startTimeRef.current = null;
      calledRef.current = false;
      return;
    }

    const loop = () => {
      if (state) {
        if (startTimeRef.current === null) {
          startTimeRef.current = Date.now();
          calledRef.current = false;
        } else {
          const elapsed = Date.now() - startTimeRef.current;
          const ratio = Math.min(elapsed / durationMs, 1);
          setProgress(Math.round(ratio * 100));

          if (elapsed >= durationMs && !calledRef.current) {
            calledRef.current = true;
            onStableTrue();
          }
        }
      } else {
        startTimeRef.current = null;
        calledRef.current = false;
        setProgress(0);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [state, durationMs, onStableTrue, enabled]);

  return progress;
};
