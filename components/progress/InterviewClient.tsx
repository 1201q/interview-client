'use client';

import WebcamInstance from '../refactorWebcam/WebcamInstance';
import InterviewSubmitButton from './InterviewSubmitButton';
import styles from './styles/i.client.module.css';
import { useInterview } from '@/utils/hooks/useInterview';

const InterviewClient = (props: ReturnType<typeof useInterview>) => {
  const currentQuestion = props.clientQuestions.find(
    (q) => q.status === 'ready' || q.status === 'answering',
  );

  return (
    <div className={styles.main}>
      <div className={styles.camera}>
        <WebcamInstance isRunning={true} drawTargets={{}} />
        <InterviewSubmitButton {...props} />
      </div>
      <div className={styles.controller}>
        <div className={styles.questionOrder}>
          질문 {currentQuestion?.order && currentQuestion.order + 1}
        </div>
        <p className={styles.questionText}>{currentQuestion?.text}</p>
      </div>
    </div>
  );
};

export default InterviewClient;
