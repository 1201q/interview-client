'use client';

import { useEffect } from 'react';

import styles from './styles/interview.client.module.css';
import TopStatusHeader from '../_components/TopStatusHeader';
import WebcamInstance from '@/components/refactorWebcam/WebcamInstance';
import { InterviewSessionType } from '@/utils/types/types';
import InterviewButton from './InterviewButton';
import {
  interviewClientStatusAtom,
  interviewSessionAtom,
  interviewSessionStatusAtom,
} from '@/store/interview';
import { useAtomValue, useSetAtom } from 'jotai';
import DisplayQuestion from './DisplayQuestion';

import Countdown from './Countdown';
import { AnimatePresence } from 'motion/react';
import { useInterviewFlow } from './hooks/useInterviewFlow';
import { useInterviewControl } from './hooks/useInterviewControl';
import { useInterviewRecorder } from './hooks/useInterviewRecorder';

const READY_SEC = 10;
const INTERVIEW_SEC = 60;

const InterviewClient = ({ data }: { data: InterviewSessionType }) => {
  const setData = useSetAtom(interviewSessionAtom);

  const sessionStatus = useAtomValue(interviewSessionStatusAtom);
  const clientStatus = useAtomValue(interviewClientStatusAtom);

  const recorder = useInterviewRecorder();
  const control = useInterviewControl(recorder);

  useInterviewFlow({
    readySec: READY_SEC,
    interviewSec: INTERVIEW_SEC,
    control,
  });

  useEffect(() => {
    setData(data);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <TopStatusHeader readySec={READY_SEC} interviewSec={INTERVIEW_SEC} />
      </div>

      <WebcamInstance isRunning={true} />

      <div className={styles.bottomContainer}>
        {sessionStatus !== 'pending' && <DisplayQuestion />}
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
