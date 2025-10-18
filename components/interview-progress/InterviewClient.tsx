'use client';

import { InterviewPhase } from '@/utils/types/interview';
import WebcamInstance from '../refactorWebcam/WebcamInstance';
import { useInterview } from './InterviewProvider';
import InterviewSubmitButton from './InterviewSubmitButton';
import styles from './styles/i.client.module.css';

import { SpeechIcon } from 'lucide-react';

import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

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

  const prefersReduce = useReducedMotion();

  const overlayKey =
    serverStatus === 'in_progress' && currentQuestion
      ? `q-${currentQuestion.id ?? currentQuestion.order}`
      : serverStatus;

  const spring = { type: 'spring', stiffness: 520, damping: 40, mass: 0.8 };
  const fade = { duration: 0.18, ease: 'easeOut' as const };

  const enter = prefersReduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 };
  const show = { opacity: 1, y: 0 };
  const exit = prefersReduce ? { opacity: 0 } : { opacity: 0, y: -14 };

  return (
    <div className={`${styles.main}`}>
      <div className={styles.top}>
        <motion.div
          className={styles.cameraWrap}
          animate={{ y: camY }}
          transition={spring}
        >
          <div className={styles.camera}>
            <WebcamInstance isRunning={cameraOn} drawTargets={{}} />

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={overlayKey}
                className={`${styles.overlayTopCard} ${overlayOff}`}
                initial={enter}
                animate={show}
                exit={exit}
                transition={spring}
              >
                <motion.span
                  className={styles.qStatus}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={fade}
                >
                  {serverStatus === 'in_progress' && currentQuestion
                    ? `질문 ${currentQuestion.order + 1}`
                    : serverStatus === 'not_started'
                      ? '면접 시작 전'
                      : '면접 종료'}
                </motion.span>

                <motion.h2
                  className={styles.qText}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ ...fade, delay: 0.03 }}
                >
                  {serverStatus === 'in_progress' && currentQuestion
                    ? currentQuestion.text
                    : serverStatus === 'not_started'
                      ? '면접이 시작되면 이 곳에 질문이 표시됩니다. ‘면접 시작하기’를 누르면 시작됩니다.'
                      : '면접이 종료되었습니다. 수고하셨습니다.'}
                </motion.h2>
              </motion.div>
            </AnimatePresence>
            {/* 하단 메인 제어 버튼  */}
            <div className={styles.overlayBottomButton}>
              <InterviewSubmitButton
                phase={props.clientPhase}
                startAnswer={props.doStartAnswer}
                startCountdown={props.doStartCountdown}
                submitAnswer={props.doSubmitAnswer}
                startInterview={props.doStartSession}
              />
            </div>

            {/* 어둡게 오버레이 */}
            <motion.div
              className={styles.cameraScreen}
              animate={{ opacity: screenOpacity }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </motion.div>
      </div>

      {/* STT 패널 상태에 따라 열림/닫힘 높이 전환 */}
      <motion.div
        animate={{ height: sttH }}
        transition={spring}
        className={styles.sttDock}
      >
        <div className={styles.sttInner}>
          <div className={styles.sttTitle}>
            <SpeechIcon size={20} />
            <h3>실시간 필사</h3>
          </div>

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
      </motion.div>
    </div>
  );
};

const Camera = () => {
  return (
    <div className={styles.camera}>
      <WebcamInstance isRunning={true} drawTargets={{}} />
      <div className={styles.qOverlay}>
        <span className={styles.qStatus}>질문 1</span>
        <h2 className={styles.qText}>
          협업에서 ‘극도의 투명함’을 실천하기 위해 평소에 유지하는 한 가지
          루틴을 소개해 주세요.
        </h2>
      </div>
    </div>
  );
};

export default InterviewClient;
