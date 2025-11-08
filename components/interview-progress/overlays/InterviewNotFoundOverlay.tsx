'use client';

import { HomeIcon, ShieldCheck } from 'lucide-react';
import styles from './styles/i.gate.module.css';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';

const InterviewNotFoundOverlay = () => {
  const router = useRouter();

  const onGoHome = () => {
    router.replace('/');
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
          key={'interview-in-progress'}
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
            해당 면접 세션은 존재하지 않습니다
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
              {'면접 세션의 ID를 다시 한 번 확인해주세요.'}
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
              <motion.button className={styles.gohomeButton} onClick={onGoHome}>
                <HomeIcon style={{ marginLeft: '-1px' }} />
                <span>홈으로</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default InterviewNotFoundOverlay;
