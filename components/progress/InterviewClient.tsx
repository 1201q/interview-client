'use client';

import { useAtomValue } from 'jotai';
import WebcamInstance from '../refactorWebcam/WebcamInstance';
import InterviewSubmitButton from './InterviewSubmitButton';

import styles from './styles/i.client.module.css';
import { CurrentSessionQuestionAtom } from '@/store/interviewSession';

const InterviewClient = () => {
  const question = useAtomValue(CurrentSessionQuestionAtom);

  return (
    <div className={styles.main}>
      <div className={styles.camera}>
        <WebcamInstance isRunning={true} drawTargets={{}} />
      </div>
      <div className={styles.controller}>
        <div className={styles.questionOrder}>질문 {question?.order}</div>
        <p className={styles.questionText}>{question?.text}</p>
      </div>
    </div>
  );
};

export default InterviewClient;
