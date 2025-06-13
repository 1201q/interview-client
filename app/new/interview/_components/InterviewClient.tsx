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
const INTERVIEW_SEC = 60;

const InterviewClient = ({ sessionId }: { sessionId: string }) => {
  const clientStatus = useAtomValue(interviewClientStatusAtom);
  const setSessionId = useSetAtom(interviewSessionIdAtom);

  const recorder = useInterviewRecorder();
  const control = useInterviewControl(recorder);

  useInterviewFlow({
    readySec: READY_SEC,
    interviewSec: INTERVIEW_SEC,
    control,
  });

  useEffect(() => {
    setSessionId(sessionId);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <TopStatusHeader readySec={READY_SEC} interviewSec={INTERVIEW_SEC} />
      </div>

      <WebcamInstance isRunning={true} />

      <div className={styles.bottomContainer}>
        {clientStatus !== 'pending' && <DisplayQuestion />}
        <div className={styles.buttonContainer}>
          {clientStatus !== 'countdown' && (
            <InterviewButton
              loading={control.loading}
              onAnswerSubmit={control.submitAnswer}
              onInterviewStart={control.startInterview}
              onInterviewComplete={control.completeInterview}
            />
          )}
        </div>
      </div>
      <AnimatePresence>
        {clientStatus === 'countdown' && <Countdown />}
      </AnimatePresence>
    </div>
  );
};

export default InterviewClient;
