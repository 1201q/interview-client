import { useCallback, useEffect, useRef, useState } from 'react';

export const useTimerController = (args: {
  fps?: number;
  onComplete?: () => void;
}) => {
  const { fps = 60, onComplete } = args ?? {};

  const [remainingMs, setRemainingMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);

  const startedAtRef = useRef(0);
  const pausedAccRef = useRef(0);
  const lastTickRef = useRef(0);

  const rafRef = useRef<number | null>(null);
  const runIdRef = useRef(0);

  const clear = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = null;
  };

  const tick = useCallback(
    (now: number, runId: number) => {
      if (runIdRef.current !== runId) return;

      if (fps > 0 && now - lastTickRef.current < 1000 / fps) {
        rafRef.current = requestAnimationFrame((t) => tick(t, runId));
        return;
      }

      lastTickRef.current = now;

      if (!running) return;

      const elapsed = now - startedAtRef.current - pausedAccRef.current;
      const remain = Math.max(0, durationMs - elapsed);

      setRemainingMs(remain);

      if (remain <= 0) {
        setRunning(false);
        setPaused(false);
        clear();
        onComplete?.();
        return;
      }

      rafRef.current = requestAnimationFrame((t) => tick(t, runId));
    },
    [running, durationMs, fps, onComplete],
  );

  const start = useCallback(
    (ms: number) => {
      clear();

      const now = performance.now();
      runIdRef.current += 1;

      setDurationMs(ms);
      setRemainingMs(ms);
      setRunning(true);
      setPaused(false);

      startedAtRef.current = now;
      pausedAccRef.current = 0;
      lastTickRef.current = 0;

      const runId = runIdRef.current;
      rafRef.current = requestAnimationFrame((t) => tick(t, runId));
    },
    [tick],
  );

  const stop = useCallback(() => {
    runIdRef.current += 1;
    clear();
    setRunning(false);
    setPaused(false);
  }, []);

  const pause = useCallback(() => {
    if (!running || paused) return;

    runIdRef.current += 1;
    clear();

    const now = performance.now();

    const elapsed = now - startedAtRef.current - pausedAccRef.current;
    const remain = Math.max(0, durationMs - elapsed);
    setRemainingMs(remain);

    setPaused(true);
    setRunning(true);
  }, [running, paused, durationMs]);

  const resume = useCallback(() => {
    if (!running || !paused) return;
    const now = performance.now();

    const elapsed = now - startedAtRef.current - (durationMs - remainingMs);
    pausedAccRef.current += elapsed < 0 ? 0 : elapsed;

    setPaused(false);
    runIdRef.current += 1;
    const rid = runIdRef.current;
    rafRef.current = requestAnimationFrame((t) => tick(t, rid));
  }, [running, paused, durationMs, remainingMs, tick]);

  useEffect(() => () => clear(), []);

  const progress = durationMs > 0 ? 1 - remainingMs / durationMs : 0;

  return {
    // state
    running,
    paused,
    durationMs,
    remainingMs,
    progress,

    // controls
    start,
    stop,
    pause,
    resume,
    setDurationMs,
    setRemainingMs,
  };
};
