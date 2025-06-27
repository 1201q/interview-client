'use client';

import { useEffect, useRef } from 'react';

export default function Waveform() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Uint8Array | null>(null);
  const historyRef = useRef<number[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const setup = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;
      dataRef.current = dataArray;

      intervalId = setInterval(drawStep, 100);

      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
    };

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    const drawStep = () => {
      const canvas = canvasRef.current;
      const analyser = analyserRef.current;
      const dataArray = dataRef.current;
      const history = historyRef.current;

      if (!canvas || !analyser || !dataArray) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      analyser.getByteTimeDomainData(dataArray);
      const raw = dataArray[0];
      const volume = Math.abs(raw - 128);
      const norm = Math.min(volume / 128, 1);
      const H = canvas.height;
      const W = canvas.width;

      const baseHeight = 6;
      const barHeight = baseHeight + norm * (H * 0.6);

      const maxBars = Math.floor(W / 4);
      const barWidth = W / maxBars;

      history.push(barHeight);
      if (history.length > maxBars) history.shift();

      ctx.clearRect(0, 0, W, H);
      history.forEach((val, i) => {
        const x = i * barWidth + barWidth / 1.5 - 1;
        const y = H / 2 - val / 2;
        ctx.fillStyle = '#9ca3af';
        ctx.fillRect(x, y, 1.5, val);
      });
    };

    setup();

    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
      clearInterval(intervalId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: 40,
        borderRadius: 9999,
        backgroundColor: '#f3f4f6',
        boxShadow: 'inset 0 0 2px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
