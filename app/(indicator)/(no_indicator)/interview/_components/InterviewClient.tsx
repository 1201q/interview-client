'use client';

import { useState } from 'react';

import styles from './styles/interview.client.module.css';
import TopStatusHeader from '../_components/TopStatusHeader';
import WebcamInstance from '@/components/refactorWebcam/WebcamInstance';

import {
  InterviewSessionStatusType,
  InterviewSessionType,
} from '@/utils/types/types';

const InterviewClient = ({ data }: { data: InterviewSessionType }) => {
  const [interviewStatus, setInterviewStatus] =
    useState<InterviewSessionStatusType>('pending');

  const stepLength = 5;
  const [stepIndex, setStepIndex] = useState(0);
  const [start, setStart] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <TopStatusHeader start={start} />
      </div>
      <div className={styles.test}>
        <button
          onClick={() => {
            if (stepIndex < stepLength - 1) {
              setStepIndex(stepIndex + 1);
            } else {
              setStepIndex(0);
            }
          }}
        >
          다음 스테이지
        </button>
        <button
          onClick={() => {
            setStart((prev) => !prev);
          }}
        >
          {start ? '종료' : '시작'}
        </button>
      </div>
      <WebcamInstance isRunning={start} />
      <div className={styles.bottomContainer}>
        {/* <Question>
          <StepIndicator length={stepLength} currentStep={stepIndex} />
        </Question> */}
        {interviewStatus === 'pending' && <button>시작하기</button>}
      </div>
    </div>
  );
};

export default InterviewClient;
