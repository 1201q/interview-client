'use client';

import WebcamInstance from '../refactorWebcam/WebcamInstance';
import InterviewSubmitButton from './InterviewSubmitButton';
import styles from './styles/i.client.module.css';
import { useInterview } from '@/utils/hooks/useInterview';
import { AnimatePresence, motion } from 'motion/react';

const InterviewClient = (props: ReturnType<typeof useInterview>) => {
  const currentQuestion = props.clientQuestions.find(
    (q) => q.status === 'ready' || q.status === 'answering',
  );

  const viewKey =
    props.serverStatus === 'in_progress' && currentQuestion
      ? `q-${currentQuestion.id}`
      : 'placeholder';

  return (
    <div className={styles.main}>
      <div className={styles.camera}>
        <WebcamInstance isRunning={true} drawTargets={{}} />
        <InterviewSubmitButton {...props} />
      </div>
      <motion.div className={styles.controller} layout>
        <AnimatePresence initial={false} mode="wait">
          {props.serverStatus === 'in_progress' && currentQuestion && (
            <motion.div
              key={viewKey}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                layout="position"
                className={styles.questionOrder}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
              >
                질문 {currentQuestion.order + 1}
              </motion.div>
              <motion.p
                layout
                className={styles.questionText}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, delay: 0.2 }}
              >
                {currentQuestion.text}
              </motion.p>
            </motion.div>
          )}
          {props.serverStatus === 'not_started' && (
            <motion.div
              key={viewKey}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                layout="position"
                className={styles.questionOrder}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
              >
                시스템
              </motion.div>
              <motion.p
                layout
                className={styles.questionText}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, delay: 0.2 }}
              >
                아직 면접이 시작되지 않았습니다. 이곳에 질문이 출력됩니다.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default InterviewClient;
