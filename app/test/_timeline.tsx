// components/GazeTimeline.tsx
'use client';
import { useEffect, useState } from 'react';
import {
  gazeDirTotals$,
  gazeEvents$,
  DirTotals,
  GazeEvent,
} from '@/store/gaze-center';

function fmt(ms: number) {
  return `${Math.round(ms / 100) / 10}s`; // 0.1초 단위
}

export default function GazeTimeline() {
  const [totals, setTotals] = useState<DirTotals>(gazeDirTotals$.value);
  const [events, setEvents] = useState<GazeEvent[]>(gazeEvents$.value);

  useEffect(() => {
    const s1 = gazeDirTotals$.subscribe(setTotals);
    const s2 = gazeEvents$.subscribe(setEvents);
    return () => {
      s1.unsubscribe();
      s2.unsubscribe();
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        right: 12,
        top: 12,
        zIndex: 20,
        padding: 12,
        borderRadius: 10,
        background: 'rgba(20,24,32,.55)',
        color: '#fff',
        backdropFilter: 'blur(6px) saturate(120%)',
        width: 280,
        maxHeight: 360,
        overflow: 'auto',
        fontSize: 12,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Direction Totals</div>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          rowGap: 6,
          color: '#eee',
        }}
      >
        <li>Left</li>
        <li style={{ textAlign: 'right' }}>{fmt(totals.left)}</li>
        <li>Right</li>
        <li style={{ textAlign: 'right' }}>{fmt(totals.right)}</li>
        <li>Up</li>
        <li style={{ textAlign: 'right' }}>{fmt(totals.up)}</li>
        <li>Down</li>
        <li style={{ textAlign: 'right' }}>{fmt(totals.down)}</li>
      </ul>

      <div style={{ fontWeight: 700, margin: '12px 0 6px' }}>Timeline</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {events.slice(-50).map((e, i) => {
          if (e.type === 'state-change') {
            return (
              <div key={i} style={{ opacity: 0.8 }}>
                {new Date(e.t).toLocaleTimeString()} — state: <b>{e.state}</b>
              </div>
            );
          }
          if (e.type === 'dir-start') {
            return (
              <div key={i}>
                {new Date(e.t).toLocaleTimeString()} — ▶ dir <b>{e.dir}</b>
              </div>
            );
          }
          return (
            <div key={i}>
              {new Date(e.t).toLocaleTimeString()} — ■ dir <b>{e.dir}</b> ended
              ({fmt(e.durMs)})
            </div>
          );
        })}
      </div>
    </div>
  );
}
