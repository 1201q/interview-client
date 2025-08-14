'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'motion/react';

import styles from './styles/interview.module.css';
import WebcamInstance from '../refactorWebcam/WebcamInstance';
import { TextIcon } from 'lucide-react';

const time = 60;

const InterviewPage = () => {
  const [cameraOn, setCameraOn] = useState(false);
  const [remainingTime, setRemainingTime] = useState(time);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const controls = useAnimationControls();

  const startTimer = useCallback(
    (time: number) => {
      controls.start({
        translateX: '-100%',
        transition: { duration: time, ease: 'linear' },
      });
    },
    [controls],
  );

  const stopTimer = useCallback(() => {
    controls.stop();
    controls.set({ translateX: '0%' });
  }, [controls]);

  useEffect(() => {
    if (cameraOn) {
      startTimer(time);
    } else {
      stopTimer();
    }
  }, [cameraOn, startTimer, stopTimer]);

  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <AnimatePresence>
          <motion.div
            layout
            animate={{ scale: cameraOn ? 1 : 0.9, opacity: cameraOn ? 1 : 0.3 }}
            transition={{ delay: cameraOn ? 1.5 : 0 }}
            className={styles.cameraContainer}
          >
            <WebcamInstance isRunning={cameraOn} drawTargets={{}} />
          </motion.div>
        </AnimatePresence>
        {cameraOn && (
          <motion.div className={styles.questionBelowContainer}>
            <motion.div
              layoutId="questionBadge"
              className={styles.badge}
              transition={{ ease: 'easeInOut', delay: 0.05 }}
            >
              질문 1
            </motion.div>
            <motion.p
              layoutId="questionText"
              transition={{ ease: 'easeInOut' }}
              className={styles.text}
            >
              도토리 서비스의 슬로우 쿼리(페이징 조회) 문제를 개선하셨다고
              했는데, 해당 이슈를 발견하게 된 계기와 개선 과정에서 가장 신경
              썼던 부분, 그리고 만약 성능 개선이 기대에 미치지 않았다면 어떤
              추가적인 시도를 했을지 말씀해 주세요.
            </motion.p>
          </motion.div>
        )}
      </div>
      {!cameraOn && (
        <motion.div className={styles.overlayQuestionContainer}>
          <motion.div
            transition={{ ease: 'easeInOut' }}
            layoutId="questionBadge"
            className={`${styles.badge} ${styles.center}`}
          >
            질문 1
          </motion.div>

          <motion.p
            layoutId="questionText"
            transition={{ ease: 'easeInOut', delay: 0.05 }}
            className={`${styles.text} ${styles.center}`}
          >
            도토리 서비스의 슬로우 쿼리(페이징 조회) 문제를 개선하셨다고 했는데,
            해당 이슈를 발견하게 된 계기와 개선 과정에서 가장 신경 썼던 부분,
            그리고 만약 성능 개선이 기대에 미치지 않았다면 어떤 추가적인 시도를
            했을지 말씀해 주세요.
          </motion.p>
        </motion.div>
      )}
      <div className={styles.timerContainer}>
        <motion.div className={styles.timerLineContainer}>
          <motion.div
            animate={controls}
            onAnimationComplete={() => setCameraOn(false)}
            className={styles.timerLine}
          ></motion.div>
        </motion.div>
      </div>
      <div className={styles.remainingTimeContainer}>2:59</div>

      <div className={styles.sideButtonContainer}>
        <motion.button
          whileHover={{
            scale: 1.1,
          }}
        >
          <p>텍스트</p>
          <TextIcon
            color="rgba(255, 255, 255, 0.4)"
            width={19}
            height={19}
            strokeWidth={3}
            style={{ marginBottom: '12px' }}
          />
        </motion.button>
      </div>
      <div style={{ position: 'fixed', top: 0, left: 0 }}>
        <button
          onClick={() => {
            setCameraOn((prev) => !prev);
          }}
        >
          애니메이션
        </button>
      </div>
    </div>
  );
};

export default InterviewPage;
