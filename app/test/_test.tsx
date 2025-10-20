'use client';
import { useEffect, useState } from 'react';
import {
  gazePhase$,
  gazeState$,
  centerDwellPct$,
  gazeDebug$,
} from '@/store/gaze-center';

export default function GazeDebugPanel() {
  const [phase, setPhase] = useState<'idle' | 'calibrating' | 'running'>(
    'idle',
  );
  const [state, setState] = useState<'center' | 'off'>('off');
  const [dwell, setDwell] = useState(0);
  const [dbg, setDbg] = useState(gazeDebug$.value);

  useEffect(() => {
    const s1 = gazePhase$.subscribe(setPhase);
    const s2 = gazeState$.subscribe(setState);
    const s3 = centerDwellPct$.subscribe(setDwell);
    const s4 = gazeDebug$.subscribe(setDbg);
    return () => {
      s1.unsubscribe();
      s2.unsubscribe();
      s3.unsubscribe();
      s4.unsubscribe();
    };
  }, []);

  const Bar = ({ v }: { v: number }) => (
    <div
      style={{
        height: 6,
        background: 'rgba(255,255,255,.15)',
        borderRadius: 4,
      }}
    >
      <div
        style={{
          width: `${Math.round(v * 100)}%`,
          height: 6,
          borderRadius: 4,
          background:
            v >= dbg.onThresh
              ? '#4ade80'
              : v <= dbg.offThresh
                ? '#f87171'
                : '#60a5fa',
        }}
      />
    </div>
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: 12,
        top: 12,
        zIndex: 20,
        padding: 10,
        borderRadius: 10,
        background: 'rgba(20,24,32,.55)',
        color: '#fff',
        backdropFilter: 'blur(6px) saturate(120%)',
        fontSize: 12,
        minWidth: 240,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          marginBottom: 6,
        }}
      >
        <span
          style={{
            padding: '2px 8px',
            borderRadius: 999,
            fontWeight: 700,
            background: state === 'center' ? '#34d399' : '#fca5a5',
            color: '#062',
          }}
        >
          {state.toUpperCase()}
        </span>
        <span>phase: {phase}</span>
        <span>Dwell: {dwell}%</span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '80px 1fr',
          gap: 6,
          alignItems: 'center',
        }}
      >
        <div>score</div>
        <Bar v={dbg.score} />
        <div>ewma</div>
        <Bar v={dbg.ewma} />
        <div>yaw°</div>
        <div>{dbg.yaw.toFixed(1)}</div>
        <div>pitch</div>
        <div>{dbg.pitch.toFixed(2)}</div>
        <div>iris dx/dy</div>
        <div>
          {dbg.irisDx.toFixed(3)} / {dbg.irisDy.toFixed(3)}
        </div>
        <div>face r</div>
        <div>{dbg.faceR.toFixed(3)}</div>
        <div>thresh</div>
        <div>
          on {dbg.onThresh} / off {dbg.offThresh}
        </div>
      </div>
    </div>
  );
}
