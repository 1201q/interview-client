'use client';

import { useRouter } from 'next/navigation';
import styles from './styles/i.gate.module.css';
import { AnimatePresence, motion } from 'motion/react';

const InterviewCompletedOverlay = ({ sessionId }: { sessionId: string }) => {
  const router = useRouter();

  const onClickGoToResults = () => {
    router.replace(`/feedback/${sessionId}`);
  };

  return (
    <motion.div
      key="gate-overlay"
      className={styles.main}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={'interview-completed'}
          className={styles.contents}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            해당 면접은 이미 종료되었습니다
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={styles.progress}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.4,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {'이미 종료된 면접입니다.'}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {'아래 버튼을 눌러 면접 결과로 이동할 수 있습니다.'}
            </motion.span>
            <motion.div
              className={styles.buttons}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 1.2,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <motion.button
                className={styles.requestPermissionButton}
                onClick={onClickGoToResults}
              >
                <span>면접 결과로 이동하기</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default InterviewCompletedOverlay;
