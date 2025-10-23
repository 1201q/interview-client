'use client';

import { InterviewPhase } from '@/utils/types/interview';
import WebcamInstance from '../refactorWebcam/WebcamInstance';
import { useInterview } from './InterviewProvider';

import styles from './styles/i.client.module.css';

import { SpeechIcon } from 'lucide-react';

import { motion, AnimatePresence } from 'motion/react';
import GlobalVideoBg from '../refactorWebcam/GlobalVideoBg';
import { Transcript } from '@/utils/types/types';

const phaseMotionMap = (phase: InterviewPhase) => {
  switch (phase) {
    case 'beforeStart':
      return { camY: -10, sttH: 0, screenOpacity: 1 };
    case 'beforeStartLoading':
      return { camY: -10, sttH: 0, screenOpacity: 1 };
    case 'start':
      return { camY: -10, sttH: 50, screenOpacity: 1 };
    case 'starting':
      return { camY: -10, sttH: 50, screenOpacity: 1 };
    case 'startCountdown3':
      return { camY: -45, sttH: 130, screenOpacity: 0 };
    case 'answering':
      return { camY: -45, sttH: 130, screenOpacity: 0 };
    case 'submitting':
      return { camY: -45, sttH: 130, screenOpacity: 1 };
    case 'submitSuccess':
      return { camY: -10, sttH: 50, screenOpacity: 1 };
    default:
      return { camY: -20, sttH: 0, screenOpacity: 1 };
  }
};

const InterviewClient = (props: ReturnType<typeof useInterview>) => {
  const { currentQuestion, serverStatus, rawStableData, clientPhase } = props;

  const { camY, sttH, screenOpacity } = phaseMotionMap(clientPhase);

  const overlayOff = screenOpacity === 1 ? styles.overlayOff : '';
  const cameraOn = screenOpacity === 0;

  return (
    <>
      <div className={styles.camera}>
        <GlobalVideoBg />
        <WebcamInstance isRunning={cameraOn} drawTargets={{}} />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div className={`${styles.overlayTopCard} ${overlayOff}`}>
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

        <Stt rawStableData={rawStableData} />
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

const Stt = ({ rawStableData }: { rawStableData: Transcript[] }) => {
  return (
    <div className={styles.sttDock}>
      <div className={styles.sttInner}>
        <div className={styles.sttIcon}>
          <SpeechIcon size={20} strokeWidth={1} />
        </div>

        <div className={styles.sttRight}>
          <h3>실시간 필사</h3>
          <div className={styles.sttScroll}>
            {rawStableData?.length ? (
              rawStableData.map((s) => (
                <span key={`s-${s.item_id}`}>{s.transcript} </span>
              ))
            ) : (
              <span>이곳에 필사 텍스트가 표시됩니다</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewClient;
