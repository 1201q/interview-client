'use client';

import { RotateCcw, HomeIcon } from 'lucide-react';
import styles from './styles/i.gate.module.css';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { resetInterviewSession } from '@/utils/services/interviewSession';
import { useState } from 'react';

const InterviewInProgressOverlay = ({ sessionId }: { sessionId: string }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const onReset = () => {
    setLoading(true);

    resetInterviewSession(sessionId)
      .then(() => {
        router.refresh();
      })
      .catch(() => {
        setLoading(false);
        alert('면접 세션 초기화에 실패했습니다. 다시 시도해주세요.');
      });
  };

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
            해당 면접은 현재 진행 중입니다
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
              {'진행 중인 면접은 중간에 다시 참여할 수 없습니다.'}
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
              {
                '아래 처음부터 시작 버튼을 눌러 면접을 처음부터 다시 시작할 수 있습니다.'
              }
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
                onClick={onReset}
                disabled={loading}
              >
                <RotateCcw
                  style={{ marginBottom: '-1px', marginLeft: '-1px' }}
                />

                <motion.span>
                  {loading ? '면접 초기화 중...' : '처음부터 시작'}
                </motion.span>
              </motion.button>
              <motion.button className={styles.gohomeButton} onClick={onGoHome}>
                <HomeIcon style={{ marginLeft: '-1px' }} />
                <span>종료하고 홈으로</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default InterviewInProgressOverlay;
