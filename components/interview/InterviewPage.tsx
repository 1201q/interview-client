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
import { QUESTION_MOCK_DATA } from '@/utils/constants/question.mock';

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
  const [interviewPhase, setInterviewPhase] =
    useState<InterviewPhaseType>('beforeStart');

  // question
  const questionList = useMemo(() => {
    return QUESTION_MOCK_DATA.map((q, index) => {
      return { ...q, order: index };
    });
  }, []);

  const [questions, setQuestions] = useState(questionList);
  const [currentQuestion, setCurrentQuestion] = useState<
    (typeof questionList)[number] | null
  >(null);
  const [nextQuestion, setNextQuestion] = useState<
    (typeof questionList)[number] | null
  >(null);
  const [submittedQuestions, setSubmittedQuestions] = useState<
    typeof questionList
  >([]);

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
    console.log(currentQuestion);
    if (interviewPhase !== 'answering') return;

    setInterviewPhase('submitting');

    try {
      await new Promise((r) => setTimeout(r, 1000));

      // 제출 성공 시
      // 1. 상태 변경
      setInterviewPhase('submitSuccess');
      // 2. mock data 변경
      const currentQ = currentQuestion; // 방금 제출 완료된 질문 => 제출 완료 배열에 넣기
      // nextQuestion : 제출 시점에서의 다음 질문 => currentQuestion으로 지정

      if (currentQ) {
        setSubmittedQuestions((prev) => {
          const updatedArray = [...prev, currentQ];

          const uniqueArray = updatedArray.filter(
            (q, index, self) => index === self.findIndex((x) => x.id === q.id),
          );

          return uniqueArray;
        }); // 제출 완료 배열에 추가
      }

      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);

        // 다음 질문 가져오기 로직 => 실제로는 api 호출해서 받아옴
        const nextQ = questions.find((q) => q.order > nextQuestion.order);

        if (nextQ) {
          setNextQuestion(nextQ);
        } else {
          setNextQuestion(null);
        }
      } else {
        // 마지막 질문이므로 종료
      }

      setTimeout(() => setInterviewPhase('start'), 1200);
    } catch (error) {
      setInterviewPhase('answering');
    }
  };

  const handleStartCountdown = async () => {
    if (interviewPhase !== 'start') return;

    setInterviewPhase('starting');

    try {
      await new Promise((r) => setTimeout(r, 1000));
      setInterviewPhase('startCountdown3');
    } catch (error) {
      setInterviewPhase('start');
    }
  };

  const handleStartAnswer = () => {
    setInterviewPhase('answering');
  };

  const handleStartInterview = async () => {
    setInterviewPhase('beforeStartLoading');

    try {
      await new Promise((r) => setTimeout(r, 1000));
      setInterviewPhase('start');
      setCurrentQuestion(questions[0]);
      setNextQuestion(questions[1]);
    } catch (error) {
      setInterviewPhase('beforeStart');
    }
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

  return (
    <LayoutGroup>
      <div className={styles.container}>
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
          <div className={styles.divider}></div>
          <p className={styles.grayText}>프론트엔드 직군</p>
        </div>
        <motion.div layout className={styles.sideListContainer}>
          <InterviewPanel
            id="questionList"
            titleText="필사 텍스트"
            isExpanded={expandedComponent.includes('questionList')}
            onToggle={handleComponentClick}
          >
            <InterviewTranscribe />
          </InterviewPanel>
          <InterviewPanel
            id="transcrie"
            titleText="질문 목록"
            isExpanded={expandedComponent.includes('transcrie')}
            onToggle={handleComponentClick}
          >
            <InterviewQuestionList
              questions={questions}
              currentQuestion={currentQuestion}
              nextQuestion={nextQuestion}
              submittedQuestions={submittedQuestions}
            />
          </InterviewPanel>
        </motion.div>
        <InterviewSubmitButton
          phase={interviewPhase}
          handleStartAnswer={handleStartAnswer}
          handleSubmitAnswer={handleSubmitAnswer}
          handleStartCountdown={handleStartCountdown}
          handleStartInterview={handleStartInterview}
        />
      </div>
    </LayoutGroup>
  );
};

export default InterviewPage;
