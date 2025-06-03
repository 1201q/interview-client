'use client';

import WebcamInstance from '@/components/refactorWebcam/WebcamInstance';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import {
  facingWarning$,
  handRaisedWarning$,
  headTiltDirectionWarning$,
  irisDirectionWarning$,
  leaningWarning$,
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
  | 'lookingRight';

const Test = () => {
  const [running, setRunning] = useState(false);
  const [warnings, setWarnings] = useState<Set<WarningKey>>(new Set());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--progress', progress.toString());
  }, [progress]);

  useEffect(() => {
    if (!running) return;
    let t = 0;
    const interval = setInterval(() => {
      t += 0.05;
      setProgress(Math.min(t / 5, 1));
      if (t >= 5) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    const gestureSub = leaningWarning$.subscribe((dir) => {
      setWarnings((prev) => {
        const newSet = new Set(prev);
        newSet.delete('leaningLeft');
        newSet.delete('leaningRight');

        if (dir === 'left') newSet.add('leaningLeft');
        else if (dir === 'right') newSet.add('leaningRight');

        return newSet;
      });
    });

    const handSub = handRaisedWarning$.subscribe((hand) => {
      setWarnings((prev) => {
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
      setWarnings((prev) => {
        const newSet = new Set(prev);
        newSet.delete('facingLeft');
        newSet.delete('facingRight');

        if (facing === 'left') newSet.add('facingLeft');
        else if (facing === 'right') newSet.add('facingRight');

        return newSet;
      });
    });

    const headSub = headTiltDirectionWarning$.subscribe((head) => {
      setWarnings((prev) => {
        const newSet = new Set(prev);
        newSet.delete('headUp');
        newSet.delete('headDown');

        if (head === 'up') newSet.add('headUp');
        else if (head === 'down') newSet.add('headDown');

        return newSet;
      });
    });

    const irisSub = irisDirectionWarning$.subscribe((iris) => {
      setWarnings((prev) => {
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

    return () => {
      gestureSub.unsubscribe();
      handSub.unsubscribe();

      facingSub.unsubscribe();
      headSub.unsubscribe();
      irisSub.unsubscribe();
    };
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
  };

  const greenWarnings = new Set<WarningKey>(['lookingCenter']);

  return (
    <div className={styles.container}>
      <WebcamInstance isRunning={running} />
      <div className={styles.faceMaskoverlay}></div>

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
    </div>
  );
};

export default Test;
