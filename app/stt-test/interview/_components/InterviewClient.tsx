'use client';

import { useEffect } from 'react';

import styles from './styles/interview.client.module.css';
import TopStatusHeader from '../_components/TopStatusHeader';
import WebcamInstance from '@/components/refactorWebcam/WebcamInstance';

import DisplayQuestion from './DisplayQuestion';

const READY_SEC = 10;

const InterviewClient = ({ sessionId }: { sessionId: string }) => {
  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <TopStatusHeader readySec={READY_SEC} />
      </div>

      <WebcamInstance isRunning={true} />

      <div className={styles.bottomContainer}>
        <DisplayQuestion />
      </div>
    </div>
  );
};

export default InterviewClient;
