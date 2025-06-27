'use client';

import { useEffect } from 'react';

import styles from './styles/interview.client.module.css';
import TopStatusHeader from '../_components/TopStatusHeader';
import WebcamInstance from '@/components/refactorWebcam/WebcamInstance';

import InterviewButton from './InterviewButton';
import { interviewClientStatusAtom } from '@/store/interview';
import { useAtomValue, useSetAtom } from 'jotai';
import DisplayQuestion from './DisplayQuestion';

import Countdown from './Countdown';
import { AnimatePresence } from 'motion/react';
import { useInterviewFlow } from './hooks/useInterviewFlow';
import { useInterviewControl } from './hooks/useInterviewControl';
import { useInterviewRecorder } from './hooks/useInterviewRecorder';
import { interviewSessionIdAtom } from '@/store/interview';

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
