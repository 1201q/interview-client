'use client';

import WebcamInstance from '@/components/refactorWebcam/WebcamInstance';
import styles from './page.module.css';
import { useEffect, useRef, useState } from 'react';
import {
  capturedResult$,
  facingWarning$,
  handRaisedWarning$,
  headTiltDirectionWarning$,
  irisDirectionWarning$,
  isFaceInCircleWarning$,
  leaningWarning$,
  startFaceCapture$,
  stopFaceCapture$,
  updateWarnings,
  warnings$,
} from '@/store/observable';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ScatterChart,
  Scatter,
} from 'recharts';

type WarningKey =
  | 'leaningLeft'
  | 'leaningRight'
  | 'handLeft'
  | 'handRight'
  | 'giveUp'
  | 'facingLeft'
  | 'facingRight'
  | 'headUp'
  | 'headDown'
  | 'lookingCenter'
  | 'lookingDown'
  | 'lookingUp'
  | 'lookingLeft'
  | 'lookingRight'
  | 'faceNotCentered';

type PhaseType =
  | 'welcome1'
  | 'welcome2'
  | 'welcome3'
  | 'checkingStart'
  | 'checkingFail'
  | 'complete';

interface DataPoint {
  x: number; // meshRaw[10][0]
  y: number; // meshRaw[10][1]
}

interface GazePoint {
  bearing: number;
  y: number;
}
interface FaceDirectionPoint {
  yaw: number;
  pitch: number;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { x: -30, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

const RenderText = ({ phase }: { phase: PhaseType }) => {
  if (phase === 'welcome1') {
    return (
      <>
        <motion.p variants={itemVariants}>얼굴을 원 안에,</motion.p>
        <motion.p variants={itemVariants}>시선은 중앙을 바라보세요.</motion.p>
      </>
    );
  } else if (phase === 'welcome2') {
    return (
      <>
        <motion.p variants={itemVariants}>가운데 원 안에</motion.p>
        <motion.p variants={itemVariants}>얼굴을 위치시키세요.</motion.p>
      </>
    );
  } else if (phase === 'checkingStart') {
    return (
      <>
        <motion.p variants={itemVariants}>얼굴 감지 시작</motion.p>
      </>
    );
  } else if (phase === 'checkingFail') {
    return (
      <>
        <motion.p variants={itemVariants}>얼굴을 원 안에 위치시키고</motion.p>
        <motion.p variants={itemVariants}>정면을 바라보세요.</motion.p>
      </>
    );
  } else if (phase === 'complete') {
    return (
      <>
        <motion.p variants={itemVariants}>얼굴 체크 성공!</motion.p>
      </>
    );
  }

  return <div></div>;
};

const Test = () => {
  const maskRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const [data, setData] = useState<DataPoint[]>([]);
  const [gaze, setGaze] = useState<GazePoint[]>([]);

  const [test, setTest] = useState<FaceDirectionPoint[]>([]);
  const maxPoints = 100;

  const [running, setRunning] = useState(false);
  const [warnings, setWarnings] = useState<Set<WarningKey>>(new Set());
  const [phase, setPhase] = useState<PhaseType>('welcome1');

  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const gestureSub = leaningWarning$.subscribe((dir) => {
      updateWarnings((prev) => {
        const newSet = new Set(prev);
        newSet.delete('leaningLeft');
        newSet.delete('leaningRight');

        if (dir === 'left') newSet.add('leaningLeft');
        else if (dir === 'right') newSet.add('leaningRight');

        return newSet;
      });
    });

    const handSub = handRaisedWarning$.subscribe((hand) => {
      updateWarnings((prev) => {
        const newSet = new Set(prev);
        newSet.delete('handLeft');
        newSet.delete('handRight');
        newSet.delete('giveUp');

        if (hand === 'left') newSet.add('handLeft');
        else if (hand === 'right') newSet.add('handRight');
        else if (hand === 'both') newSet.add('giveUp');

        return newSet;
      });
    });

    const facingSub = facingWarning$.subscribe((facing) => {
      updateWarnings((prev) => {
        const newSet = new Set(prev);
        newSet.delete('facingLeft');
        newSet.delete('facingRight');

        if (facing === 'left') newSet.add('facingLeft');
        else if (facing === 'right') newSet.add('facingRight');

        return newSet;
      });
    });

    const headSub = headTiltDirectionWarning$.subscribe((head) => {
      updateWarnings((prev) => {
        const newSet = new Set(prev);
        newSet.delete('headUp');
        newSet.delete('headDown');

        if (head === 'up') newSet.add('headUp');
        else if (head === 'down') newSet.add('headDown');

        return newSet;
      });
    });

    const irisSub = irisDirectionWarning$.subscribe((iris) => {
      updateWarnings((prev) => {
        const newSet = new Set(prev);
        newSet.delete('lookingCenter');
        newSet.delete('lookingRight');
        newSet.delete('lookingLeft');
        newSet.delete('lookingUp');
        newSet.delete('lookingDown');

        if (iris === 'center') newSet.add('lookingCenter');
        else if (iris === 'down') newSet.add('lookingDown');
        else if (iris === 'up') newSet.add('lookingUp');
        else if (iris === 'left') newSet.add('lookingLeft');
        else if (iris === 'right') newSet.add('lookingRight');

        return newSet;
      });
    });

    const isInSub = isFaceInCircleWarning$.subscribe((isIn) => {
      updateWarnings((prev) => {
        const newSet = new Set(prev);
        if (isIn) {
          newSet.delete('faceNotCentered');
        } else {
          newSet.add('faceNotCentered');
        }
        return newSet;
      });
    });

    return () => {
      gestureSub.unsubscribe();
      handSub.unsubscribe();

      facingSub.unsubscribe();
      headSub.unsubscribe();
      irisSub.unsubscribe();

      isInSub.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const sub = warnings$.subscribe((value) => {
      setWarnings(new Set(value));
    });
    return () => sub.unsubscribe();
  }, []);

  useEffect(() => {
    const sub = capturedResult$.subscribe((frames) => {
      const points = frames
        .map((f) => {
          const raw = f?.meshRaw?.[10];
          if (!raw || raw.length < 2) return null;

          const [x, y] = raw;
          return { x, y };
        })
        .filter(Boolean) as DataPoint[];

      setData((prev) => {
        const next = [...prev, ...points];
        return next.length > maxPoints ? next.slice(-maxPoints) : next;
      });

      const data = frames
        .map((f) => {
          const angle = f?.rotation?.angle;
          if (!angle) return null;

          return {
            yaw: angle.yaw * (180 / Math.PI), // 라디안 → 도
            pitch: angle.pitch * (180 / Math.PI),
          };
        })
        .filter(Boolean) as FaceDirectionPoint[];

      setTest((prev) => {
        const next = [...prev, ...data];
        return next.length > maxPoints ? next.slice(-maxPoints) : next;
      });
    });

    return () => sub.unsubscribe();
  }, []);

  const warningMessages: Record<WarningKey, string> = {
    leaningLeft: '몸이 왼쪽으로 기울어졌습니다.',
    leaningRight: '몸이 오른쪽으로 기울어졌습니다.',
    handLeft: '왼손을 들었습니다.',
    handRight: '오른손을 들었습니다.',
    giveUp: '항복 제스처 감지됨.',
    facingLeft: '얼굴이 왼쪽 방향임.',
    facingRight: '얼굴이 오른쪽 방향임.',
    headUp: '고개가 윗방향임.',
    headDown: '고개가 아랫방향임.',
    lookingCenter: '시선이 중앙임.',
    lookingLeft: '시선이 왼쪽임.',
    lookingRight: '시선이 오른쪽임',
    lookingUp: '시선이 윗방향임.',
    lookingDown: '시선이 아랫방향임.',
    faceNotCentered: '얼굴을 원 안으로 위치시키세요.',
  };

  const greenWarnings = new Set<WarningKey>(['lookingCenter']);

  const handleStart = () => {
    setData([]);
    setTest([]);
    startFaceCapture$.next();
  };

  const handleStop = () => {
    stopFaceCapture$.next();
  };

  return (
    <div className={styles.container}>
      <WebcamInstance isRunning={running} />

      <div ref={maskRef} className={styles.faceMaskoverlay}></div>
      {/* <div className={styles.bottomTextContainer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className={styles.textWrapper}
          >
            <RenderText phase={phase} />
          </motion.div>
        </AnimatePresence>
      </div> */}

      <div className={styles.sideAlarmContainer}>
        <AnimatePresence>
          {[...warnings].map((key) => (
            <motion.span
              key={key}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.1 }}
              className={
                greenWarnings.has(key)
                  ? styles.greenWarning
                  : styles.defaultWarning
              }
            >
              {warningMessages[key]}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <button
        className={styles.testButton}
        onClick={() => setRunning((prev) => !prev)}
      >
        {running ? '정지' : '시작'}
      </button>

      <button className={styles.testButton2} onClick={handleStart}>
        면접 시작
      </button>

      <button className={styles.testButton3} onClick={handleStop}>
        면접 종료
      </button>

      <div className={styles.chartContainer}>
        {data.length !== 0 && (
          <>
            <ScatterChart width={320} height={270}>
              <CartesianGrid />
              <XAxis
                type="number"
                dataKey="x"
                name="X Position"
                domain={[0.3, 0.7]}
                tickCount={7}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Y Position"
                domain={[0.2, 0.6]}
                tickCount={5}
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter
                name="Face Center"
                data={data}
                fill="#8884d8"
                shape="circle"
              />
            </ScatterChart>

            <ScatterChart width={600} height={300}>
              <CartesianGrid />
              <XAxis
                type="number"
                dataKey="yaw"
                name="Yaw (좌우 회전)"
                domain={[-45, 45]}
                tickFormatter={(v) => `${v}°`}
              />
              <YAxis
                type="number"
                dataKey="pitch"
                name="Pitch (상하 회전)"
                domain={[-30, 30]}
                tickFormatter={(v) => `${v}°`}
              />
              <Tooltip />
              <Scatter
                name="Face Direction"
                data={test}
                fill="#8884d8"
                shape="circle"
              />
            </ScatterChart>
          </>
        )}
      </div>
    </div>
  );
};

export default Test;
