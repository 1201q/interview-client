'use client';

import { InterviewPhase } from '@/utils/types/interview';
import WebcamInstance from '../refactorWebcam/WebcamInstance';
import { useInterview } from './InterviewProvider';

import styles from './styles/i.client.module.css';

import { motion, AnimatePresence } from 'motion/react';

import InterviewSttDock from './InterviewSttDock';

const phaseMotionMap = (phase: InterviewPhase) => {
  switch (phase) {
    case 'beforeStart':
      return { screenOpacity: 1, cameraOn: false };
    case 'beforeStartLoading':
      return { screenOpacity: 1, cameraOn: false };
    case 'start':
      return { screenOpacity: 1, cameraOn: false };
    case 'starting':
      return { screenOpacity: 1, cameraOn: false };
    case 'startCountdown3':
      return { screenOpacity: 1, cameraOn: true };
    case 'answering':
      return { screenOpacity: 0, cameraOn: true };
    case 'submitting':
      return { screenOpacity: 1, cameraOn: false };
    case 'submitSuccess':
      return { screenOpacity: 1, cameraOn: false };
    default:
      return { screenOpacity: 1, cameraOn: false };
  }
};

const InterviewClient = (props: ReturnType<typeof useInterview>) => {
  const {
    currentQuestion,
    serverStatus,
    rawStableData,
    clientPhase,
    visibleSttComponent,
    cameraObjectFitOpt,
  } = props;

  const { screenOpacity, cameraOn } = phaseMotionMap(clientPhase);

  return (
    <>
      <div className={styles.camera}>
        <WebcamInstance
          cameraObjectFitOpt={cameraObjectFitOpt}
          isRunning={cameraOn}
          drawTargets={{}}
        />

        <div className={styles.cameraShadeTop} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div className={`${styles.overlayTopCard}`}>
            <motion.span className={styles.qStatus}>
              {serverStatus === 'in_progress' && currentQuestion
                ? `질문 ${currentQuestion.order + 1}`
                : serverStatus === 'not_started'
                  ? '면접 시작 전'
                  : '면접 종료'}
            </motion.span>

            <motion.h2 className={styles.qText}>
              {serverStatus === 'in_progress' && currentQuestion
                ? currentQuestion.text
                : serverStatus === 'not_started'
                  ? '면접이 시작되면 이 곳에 질문이 표시됩니다. ‘면접 시작하기’를 누르면 시작됩니다.'
                  : '면접이 종료되었습니다. 수고하셨습니다.'}
            </motion.h2>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {visibleSttComponent && (
            <InterviewSttDock rawStableData={rawStableData} />
          )}
        </AnimatePresence>
        {/* 어둡게 오버레이 */}
        <motion.div
          className={styles.cameraScreen}
          animate={{ opacity: screenOpacity }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </>
  );
};

export default InterviewClient;
