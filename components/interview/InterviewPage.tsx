'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import styles from './styles/interview.module.css';
import WebcamInstance from '../refactorWebcam/WebcamInstance';
import InterviewPanel from './InterviewPanel';
import InterviewTranscribe from './InterviewTranscribe';
import InterviewQuestionList from './InterviewQuestionList';

import InterviewSubmitButton from './InterviewSubmitButton';
import InterviewTimebar from './InterviewTimebar';
import { InterviewPhase } from '@/utils/types/interview';

type SideComponent = 'transcrie' | 'questionList';

const InterviewPage = () => {
  const [cameraOn, setCameraOn] = useState(false);
  const [expandedComponent, setExpandedComponent] = useState<SideComponent[]>(
    [],
  );
  const [interviewPhase, setInterviewPhase] = useState<InterviewPhase>('start');

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

    try {
      await new Promise((r) => setTimeout(r, 1000));
      setInterviewPhase('submitSuccess');
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

  useEffect(() => {
    if (interviewPhase === 'startCountdown3') {
      setCameraOn(true);
    } else if (interviewPhase === 'submitting') {
      setCameraOn(false);
    }
  }, [interviewPhase]);

  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <AnimatePresence>
          <motion.div
            layout
            animate={{ scale: cameraOn ? 1 : 0.9, opacity: cameraOn ? 1 : 0.3 }}
            transition={{ delay: cameraOn ? 0.05 : 0 }}
            className={styles.cameraContainer}
          >
            <WebcamInstance isRunning={cameraOn} drawTargets={{}} />
          </motion.div>
        </AnimatePresence>
        {cameraOn && (
          <motion.div className={styles.questionBelowContainer}>
            <motion.div
              layoutId="questionBadge"
              className={styles.badge}
              transition={{ ease: 'easeInOut', duration: 0.25 }}
            >
              질문 1
            </motion.div>
            <motion.p
              layoutId="questionText"
              transition={{ ease: 'easeInOut', duration: 0.25 }}
              className={styles.text}
            >
              도토리 서비스의 슬로우 쿼리(페이징 조회) 문제를 개선하셨다고
              했는데, 해당 이슈를 발견하게 된 계기와 개선 과정에서 가장 신경
              썼던 부분, 그리고 만약 성능 개선이 기대에 미치지 않았다면 어떤
              추가적인 시도를 했을지 말씀해 주세요.
            </motion.p>
          </motion.div>
        )}
      </div>
      {!cameraOn && (
        <motion.div className={styles.overlayQuestionContainer}>
          <motion.div
            transition={{ ease: 'easeInOut', duration: 0.3 }}
            layoutId="questionBadge"
            className={`${styles.badge} ${styles.center}`}
          >
            질문 1
          </motion.div>

          <motion.p
            layoutId="questionText"
            transition={{ ease: 'easeInOut', duration: 0.3 }}
            className={`${styles.text} ${styles.center}`}
          >
            도토리 서비스의 슬로우 쿼리(페이징 조회) 문제를 개선하셨다고 했는데,
            해당 이슈를 발견하게 된 계기와 개선 과정에서 가장 신경 썼던 부분,
            그리고 만약 성능 개선이 기대에 미치지 않았다면 어떤 추가적인 시도를
            했을지 말씀해 주세요.
          </motion.p>
        </motion.div>
      )}
      <div className={styles.timerContainer}>
        <InterviewTimebar
          phase={interviewPhase}
          handleSubmitAnswer={handleSubmitAnswer}
          handleStartCountdown={handleStartCountdown}
        />
      </div>
      {/* <div className={styles.remainingTimeContainer}>2:59</div> */}
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
          <InterviewQuestionList />
        </InterviewPanel>
      </motion.div>
      <div className={styles.bottomButtonController}>
        <InterviewSubmitButton
          phase={interviewPhase}
          handleStartAnswer={handleStartAnswer}
          handleSubmitAnswer={handleSubmitAnswer}
          handleStartCountdown={handleStartCountdown}
        />
      </div>

      <div style={{ position: 'fixed', top: 0, left: 0 }}>
        <button
          onClick={() => {
            setCameraOn((prev) => !prev);
          }}
        >
          애니메이션
        </button>
      </div>
    </div>
  );
};

export default InterviewPage;
