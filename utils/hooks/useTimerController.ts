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

  // -------- --------
  const runningRef = useRef(false);
  const pausedRef = useRef(false);
  const durationMsRef = useRef(0);
  const onCompleteRef = useRef<(() => void) | undefined>(onComplete);
  const fpsRef = useRef(fps);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    fpsRef.current = fps;
  }, [fps]);

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

  const tick = (now: number, runId: number) => {
    if (runIdRef.current !== runId) return;

    const fpsLocal = fpsRef.current;

    if (fpsLocal > 0 && now - lastTickRef.current < 1000 / fpsLocal) {
      rafRef.current = requestAnimationFrame((t) => tick(t, runId));
      return;
    }

    lastTickRef.current = now;

    if (!runningRef.current || pausedRef.current) return;

    const elapsed = now - startedAtRef.current - pausedAccRef.current;
    const remain = Math.max(0, durationMsRef.current - elapsed);

    setRemainingMs(remain);

    if (remain <= 0) {
      runningRef.current = false;
      setRunning(false);

      pausedRef.current = false;
      setPaused(false);

      clear();
      onCompleteRef.current?.();
      return;
    }

    rafRef.current = requestAnimationFrame((t) => tick(t, runId));
  };

  const start = useCallback((ms: number) => {
    clear();

    const now = performance.now();
    runIdRef.current += 1;

    durationMsRef.current = ms;
    setDurationMs(ms);
    setRemainingMs(ms);

    runningRef.current = true;
    setRunning(true);

    pausedRef.current = false;
    setPaused(false);

    startedAtRef.current = now;
    pausedAccRef.current = 0;
    lastTickRef.current = 0;

    const runId = runIdRef.current;
    rafRef.current = requestAnimationFrame((t) => tick(t, runId));
  }, []);

  const stop = useCallback(() => {
    runIdRef.current += 1;
    runningRef.current = false;
    pausedRef.current = false;

    clear();
    setRunning(false);
    setPaused(false);
  }, []);

  const pause = useCallback(() => {
    if (!runningRef.current || pausedRef.current) return;

    runIdRef.current += 1;
    clear();

    const now = performance.now();

    const elapsed = now - startedAtRef.current - pausedAccRef.current;
    const remain = Math.max(0, durationMsRef.current - elapsed);
    setRemainingMs(remain);

    pausedRef.current = true;
    setPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (!runningRef.current || !pausedRef.current) return;

    const now = performance.now();
    const elapsed =
      now - startedAtRef.current - (durationMsRef.current - remainingMs);
    pausedAccRef.current += elapsed < 0 ? 0 : elapsed;

    pausedRef.current = false;
    setPaused(false);

    runIdRef.current += 1;
    const rid = runIdRef.current;
    rafRef.current = requestAnimationFrame((t) => tick(t, rid));
  }, [remainingMs]);

  useEffect(() => () => clear(), []);

  const progress =
    durationMsRef.current > 0 ? 1 - remainingMs / durationMsRef.current : 0;
  const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

  return {
    // state
    running,
    paused,
    durationMs,
    remainingMs,
    remainingSec,
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
