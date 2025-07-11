'use client';

import { useEffect } from 'react';

import styles from './styles/interview.client.module.css';
import TopStatusHeader from '../_components/TopStatusHeader';
import WebcamInstance from '@/components/refactorWebcam/WebcamInstance';

import InterviewButton from './InterviewButton';
import { answerTextAtom, interviewClientStatusAtom } from '@/store/interview';
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
  const clientStatus = useAtomValue(interviewClientStatusAtom);
  const setSessionId = useSetAtom(interviewSessionIdAtom);

  const setAnswerText = useSetAtom(answerTextAtom);

  const recorder = useInterviewRecorder();
  const control = useInterviewControl(recorder);

  useInterviewFlow({
    readySec: READY_SEC,
    control,
  });

  useEffect(() => {
    setSessionId(sessionId);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <TopStatusHeader readySec={READY_SEC} />
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
        <textarea
          className={styles.textarea}
          onChange={(e) => {
            setAnswerText(e.target.value);
          }}
        ></textarea>
      </div>
      <AnimatePresence>
        {clientStatus === 'countdown' && <Countdown />}
      </AnimatePresence>
    </div>
  );
};

export default InterviewClient;
