'use client';
import { useEffect, useRef, useState } from 'react';
import WebcamInstance from '@/components/refactorWebcam/WebcamInstance';
import styles from './page.module.css';

import {
  startCalibration$,
  startGaze$,
  stopGaze$,
  gazePhase$,
  gazeState$,
  centerDwellPct$,
  gazeStats$,
} from '@/store/gaze-center';
import GazeDebugPanel from './_test';
import GazeTimeline from './_timeline';

const Page = () => {
  const [cameraOn, setCameraOn] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'calibrating' | 'running'>(
    'idle',
  );
  const [state, setState] = useState<'center' | 'off'>('off');
  const [dwell, setDwell] = useState(0);
  const [stats, setStats] = useState({
    validFrames: 0,
    centerFrames: 0,
    offEpisodes: 0,
    maxOffStreakMs: 0,
  });

  useEffect(() => {
    const s1 = gazePhase$.subscribe(setPhase);
    const s2 = gazeState$.subscribe(setState);
    const s3 = centerDwellPct$.subscribe(setDwell);
    const s4 = gazeStats$.subscribe(setStats);
    return () => {
      s1.unsubscribe();
      s2.unsubscribe();
      s3.unsubscribe();
      s4.unsubscribe();
    };
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.camera}>
        <WebcamInstance isRunning={cameraOn} drawTargets={{ face: true }} />
        <GazeDebugPanel />
        <GazeTimeline />
        <div className={styles.overlay}>
          <span
            className={`${styles.badge} ${state === 'center' ? styles.ok : styles.warn}`}
          >
            {state === 'center' ? 'CENTER' : 'OFF'}
          </span>
          <span className={styles.text}>Dwell {dwell}%</span>
          <span className={styles.textSmall}>phase: {phase}</span>
        </div>
      </div>

      <div className={styles.buttons}>
        <button onClick={() => setCameraOn(true)}>camera on</button>
        <button onClick={() => setCameraOn(false)}>camera off</button>

        <button
          onClick={() => {
            console.log('start calibration');
            startCalibration$.next();
          }}
          disabled={!cameraOn || phase !== 'idle'}
        >
          캘리브레이션
        </button>

        <button
          onClick={() => startGaze$.next()}
          disabled={
            !cameraOn ||
            phase !== 'idle' ||
            !(/* 캘리브레이션 완료 여부 */ true)
          }
          title="캘리브레이션 후 실행하세요"
        >
          시작
        </button>

        <button onClick={() => stopGaze$.next()} disabled={phase === 'idle'}>
          종료
        </button>
      </div>

      <div className={styles.summary}>
        <p>Valid Frames: {stats.validFrames}</p>
        <p>Center Frames: {stats.centerFrames}</p>
        <p>Off Episodes: {stats.offEpisodes}</p>
        <p>Max Off Streak: {Math.round(stats.maxOffStreakMs / 100) / 10}s</p>
      </div>
    </div>
  );
};

export default Page;
