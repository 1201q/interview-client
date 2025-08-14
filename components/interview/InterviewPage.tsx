'use client';

import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';

import styles from './styles/interview.module.css';
import WebcamInstance from '../refactorWebcam/WebcamInstance';

const InterviewPage = () => {
  const [cameraOn, setCameraOn] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <AnimatePresence>
          <motion.div
            layout
            animate={{ scale: cameraOn ? 1 : 0.9, opacity: cameraOn ? 1 : 0.3 }}
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
        <motion.div
          className={`${styles.overlayQuestionContainer} ${styles.center}`}
        >
          <motion.div
            transition={{ ease: 'easeInOut' }}
            layoutId="questionBadge"
            className={styles.badge}
          >
            질문 1
          </motion.div>
          <motion.p
            layoutId="questionText"
            transition={{ ease: 'easeInOut', delay: 0.05 }}
            className={styles.text}
          >
            도토리 서비스의 슬로우 쿼리(페이징 조회) 문제를 개선하셨다고 했는데,
            해당 이슈를 발견하게 된 계기와 개선 과정에서 가장 신경 썼던 부분,
            그리고 만약 성능 개선이 기대에 미치지 않았다면 어떤 추가적인 시도를
            했을지 말씀해 주세요.
          </motion.p>
        </motion.div>
      )}

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
