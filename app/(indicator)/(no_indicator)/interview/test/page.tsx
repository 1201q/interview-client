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
    const sub = capturedResult$.subscribe((data) => {
      console.log(data);

      const std = (arr: number[]) => {
        const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
        const variance =
          arr.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / arr.length;
        return Math.sqrt(variance);
      };

      const xs = data.map((f) => f.meshRaw[10][0]);
      console.log(std(xs));

      const diffs = xs.slice(1).map((v, i) => Math.abs(v - xs[i]));
      const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;

      console.log(avgDiff);
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
    </div>
  );
};

export default Test;
