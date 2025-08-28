'use client';

import { motion, AnimatePresence, LayoutGroup, Transition } from 'motion/react';

import styles from './styles/interview.module.css';
import WebcamInstance from '../refactorWebcam/WebcamInstance';
import InterviewPanel from './InterviewPanel';
import InterviewTranscribe from './InterviewTranscribe';
import InterviewQuestionList from './InterviewQuestionList';

import InterviewSubmitButton from './InterviewSubmitButton';
import InterviewTimebar from './InterviewTimebar';
import InterviewTimer from './InterviewTimer';

import { resetInterviewSession } from '@/utils/services/interviewSession';
import { useInterviewController } from '@/utils/hooks/useInterviewController';
import { QSessionQuestionItem } from '@/utils/types/interview';

const spring: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 40,
  mass: 0.2,
};

const InterviewPage = () => {
  const { ui, interview, stt, action, time } = useInterviewController();

  const {
    cameraOn,
    isBelowTextVisible,
    isOverlayTextVisible,
    expanded,
    togglePanel,
  } = ui;

  const { phase, question, jobRole, sessionId } = interview;
  const { rawStableData, canResume } = stt;
  const { startAnswer, startCountdown, startInterview, submitAnswer } = action;
  const { remainingSec, barProgress } = time;

  return (
    <>
      <LayoutGroup>
        <motion.div
          initial="hidden"
          animate="visible"
          className={styles.container}
        >
          <div className={styles.mainContainer}>
            {/* webcam */}
            <AnimatePresence>
              <motion.div
                layout
                animate={{
                  scale: cameraOn ? 1 : 0.9,
                  opacity: cameraOn && phase !== 'startCountdown3' ? 1 : 0.3,
                }}
                transition={{ delay: cameraOn ? 0.05 : 0 }}
                className={styles.cameraContainer}
              >
                <WebcamInstance isRunning={cameraOn} drawTargets={{}} />
              </motion.div>
            </AnimatePresence>

            {/* BelowQuestionText */}
            <AnimatePresence mode="wait">
              {isBelowTextVisible && question && (
                <BelowQuestionText question={question} />
              )}
            </AnimatePresence>
          </div>

          {/* OverlayQuestionText */}
          <AnimatePresence mode="wait">
            {isOverlayTextVisible && question && (
              <OverlayQuestionText question={question} />
            )}
          </AnimatePresence>

          {/* timebar */}
          <InterviewTimebar phase={phase} progress={barProgress} />
          {/* timer */}
          <InterviewTimer phase={phase} remainingSec={remainingSec} />

          {/* InterviewInfo */}
          <InterviewInfo jobRole={jobRole} />

          {/* panel */}
          <motion.div layout className={styles.sideListContainer}>
            <InterviewPanel
              id="questionList"
              titleText="필사 텍스트"
              isExpanded={expanded.includes('questionList')}
              onToggle={togglePanel}
            >
              <InterviewTranscribe
                rawStableData={rawStableData}
                canResume={canResume}
              />
            </InterviewPanel>
            <InterviewPanel
              id="transcrie"
              titleText="질문 목록"
              isExpanded={expanded.includes('transcrie')}
              onToggle={togglePanel}
            >
              <InterviewQuestionList />
            </InterviewPanel>
          </motion.div>

          {/* InterviewSubmitButton */}
          <InterviewSubmitButton
            phase={phase}
            startAnswer={startAnswer}
            submitAnswer={submitAnswer}
            startCountdown={startCountdown}
            startInterview={startInterview}
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

const OverlayQuestionText = ({
  question,
}: {
  question: QSessionQuestionItem;
}) => {
  return (
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
        {`질문 ${question.order + 1}`}
      </motion.div>

      <motion.p
        layoutId="questionText"
        transition={spring}
        className={`${styles.text} ${styles.center}`}
      >
        {question.text}
      </motion.p>
    </motion.div>
  );
};

const BelowQuestionText = ({
  question,
}: {
  question: QSessionQuestionItem;
}) => {
  return (
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
        {`질문 ${question && question?.order + 1}`}
      </motion.div>
      <motion.p
        layoutId="questionText"
        transition={spring}
        className={styles.text}
      >
        {question?.text}
      </motion.p>
    </motion.div>
  );
};

const InterviewInfo = ({ jobRole }: { jobRole?: string }) => {
  return (
    <div className={styles.interviewInfoContainer}>
      <p className={styles.blueGradientText}>모의 인터뷰</p>
      {jobRole && (
        <>
          <div className={styles.divider}></div>
          <p className={styles.grayText}>{jobRole}</p>
        </>
      )}
    </div>
  );
};

export default InterviewPage;
