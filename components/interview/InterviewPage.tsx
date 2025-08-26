'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup, Transition } from 'motion/react';

import styles from './styles/interview.module.css';
import WebcamInstance from '../refactorWebcam/WebcamInstance';
import InterviewPanel from './InterviewPanel';
import InterviewTranscribe from './InterviewTranscribe';
import InterviewQuestionList from './InterviewQuestionList';

import InterviewSubmitButton from './InterviewSubmitButton';
import InterviewTimebar from './InterviewTimebar';
import { InterviewPhase as InterviewPhaseType } from '@/utils/types/interview';
import InterviewTimer from './InterviewTimer';
import { useTranscribe } from '@/utils/hooks/useTranscribe';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  ClientInterviewPhaseAtom,
  CurrentSessionQuestionAtom,
  InterviewJobRoleAtom,
  SessionIdAtom,
  StartAnswerCountdownAtom,
  StartInterviewSessionAtom,
  SubmitAnswerAtom,
} from '@/store/interviewSession';

import { resetInterviewSession } from '@/utils/services/interviewSession';

type SideComponent = 'transcrie' | 'questionList';

const spring: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 40,
  mass: 0.2,
};

const InterviewPage = () => {
  const [cameraOn, setCameraOn] = useState(false);
  const [expandedComponent, setExpandedComponent] = useState<SideComponent[]>(
    [],
  );

  const [interviewPhase, setInterviewPhase] = useAtom(ClientInterviewPhaseAtom);

  const currentQuestion = useAtomValue(CurrentSessionQuestionAtom);

  const startInterviewSession = useSetAtom(StartInterviewSessionAtom);
  const startAnswerCountdown = useSetAtom(StartAnswerCountdownAtom);
  const submitAnswer = useSetAtom(SubmitAnswerAtom);
  const sessionId = useAtomValue(SessionIdAtom);

  const {
    connected,
    isRecording,
    canResume,
    rawStableData,
    flushAndStop,
    resumeTranscription,
    connectTranscription,
    prepareAudioTrack,
  } = useTranscribe({
    onEvent: (e: any) => {},
  });

  const handleComponentClick = useCallback((type: SideComponent) => {
    setExpandedComponent((prev) => {
      if (prev.includes(type)) {
        return prev.filter((item) => item !== type);
      } else {
        return [...prev, type];
      }
    });
  }, []);

  const handleSubmitAnswer = async () => {
    if (interviewPhase !== 'answering') return;
    setInterviewPhase('submitting');

    const data = await flushAndStop();

    console.log(data);

    submitAnswer({
      audioBlob: data.audioBlob,
      answerText: data.text,
    });
  };

  const handleStartCountdown = useCallback(async () => {
    if (interviewPhase !== 'start') return;

    setInterviewPhase('starting');

    try {
      await connectTranscription();
      await prepareAudioTrack('tab');

      startAnswerCountdown();

      setInterviewPhase('startCountdown3');
    } catch (error) {
      console.log(error);
      setInterviewPhase('start');
    }
  }, [interviewPhase, setInterviewPhase]);

  const handleStartAnswer = useCallback(() => {
    if (!canResume) {
      throw new Error('stt 미연결2');
    }

    try {
      resumeTranscription();

      setInterviewPhase('answering');
    } catch (error) {
      throw new Error('resume 실패');
    }
  }, [canResume, connected, isRecording, setInterviewPhase, interviewPhase]);

  const handleStartInterview = async () => {
    startInterviewSession();
  };

  useEffect(() => {
    if (interviewPhase === 'startCountdown3') {
      setCameraOn(true);
    } else if (interviewPhase === 'submitting') {
      setCameraOn(false);
    }
  }, [interviewPhase]);

  const isBelowTextVisible = (
    ['startCountdown3', 'answering'] as InterviewPhaseType[]
  ).includes(interviewPhase);
  const isOverlayTextVisible = (
    ['start', 'starting'] as InterviewPhaseType[]
  ).includes(interviewPhase);

  // jotai
  const jobRole = useAtomValue(InterviewJobRoleAtom);

  return (
    <>
      <LayoutGroup>
        <motion.div
          initial="hidden"
          animate="visible"
          className={styles.container}
        >
          <div className={styles.mainContainer}>
            <AnimatePresence>
              <motion.div
                layout
                animate={{
                  scale: cameraOn ? 1 : 0.9,
                  opacity:
                    cameraOn && interviewPhase !== 'startCountdown3' ? 1 : 0.3,
                }}
                transition={{ delay: cameraOn ? 0.05 : 0 }}
                className={styles.cameraContainer}
              >
                <WebcamInstance isRunning={cameraOn} drawTargets={{}} />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {isBelowTextVisible && (
                <motion.div
                  className={styles.questionBelowContainer}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={spring}
                >
                  <motion.div
                    layoutId="questionBadge"
                    className={styles.badge}
                    transition={spring}
                  >
                    {`질문 ${currentQuestion && currentQuestion?.order + 1}`}
                  </motion.div>
                  <motion.p
                    layoutId="questionText"
                    transition={spring}
                    className={styles.text}
                  >
                    {currentQuestion?.text}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            {isOverlayTextVisible && (
              <motion.div
                className={styles.overlayQuestionContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={spring}
              >
                <motion.div
                  transition={spring}
                  layoutId="questionBadge"
                  className={`${styles.badge} ${styles.center}`}
                >
                  {`질문 ${currentQuestion && currentQuestion?.order + 1}`}
                </motion.div>

                <motion.p
                  layoutId="questionText"
                  transition={spring}
                  className={`${styles.text} ${styles.center}`}
                >
                  {currentQuestion?.text}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
          <InterviewTimebar
            phase={interviewPhase}
            handleSubmitAnswer={handleSubmitAnswer}
            handleStartCountdown={handleStartCountdown}
          />
          <InterviewTimer phase={interviewPhase} />

          <div className={styles.interviewInfoContainer}>
            <p className={styles.blueGradientText}>모의 인터뷰</p>
            {jobRole && (
              <>
                <div className={styles.divider}></div>
                <p className={styles.grayText}>{jobRole}</p>
              </>
            )}
          </div>
          <motion.div layout className={styles.sideListContainer}>
            <InterviewPanel
              id="questionList"
              titleText="필사 텍스트"
              isExpanded={expandedComponent.includes('questionList')}
              onToggle={handleComponentClick}
            >
              <InterviewTranscribe
                rawStableData={rawStableData}
                canResume={canResume}
              />
            </InterviewPanel>
            <InterviewPanel
              id="transcrie"
              titleText="질문 목록"
              isExpanded={expandedComponent.includes('transcrie')}
              onToggle={handleComponentClick}
            >
              <InterviewQuestionList />
            </InterviewPanel>
          </motion.div>
          <InterviewSubmitButton
            phase={interviewPhase}
            handleStartAnswer={handleStartAnswer}
            handleSubmitAnswer={handleSubmitAnswer}
            handleStartCountdown={handleStartCountdown}
            handleStartInterview={handleStartInterview}
          />
        </motion.div>
      </LayoutGroup>
      <div
        style={{ position: 'fixed', top: 0, left: 0, backgroundColor: 'white' }}
      >
        <button
          onClick={async () => {
            if (!sessionId) return;

            const res = await resetInterviewSession(sessionId);

            if (res.status === 'not_started') {
              console.log('성공');
            }
          }}
        >
          초기화
        </button>
      </div>
    </>
  );
};

export default InterviewPage;
