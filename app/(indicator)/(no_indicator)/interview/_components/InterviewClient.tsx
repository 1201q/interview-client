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

const InterviewClient = ({ data }: { data: InterviewSessionType }) => {
  const setData = useSetAtom(interviewSessionAtom);

  const sessionStatus = useAtomValue(interviewSessionStatusAtom);
  const clientStatus = useAtomValue(interviewClientStatusAtom);

  useEffect(() => {
    setData(data);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <TopStatusHeader />
      </div>

      <WebcamInstance isRunning={true} />
      <div className={styles.bottomContainer}>
        {sessionStatus !== 'pending' && <DisplayQuestion />}
        <div className={styles.buttonContainer}>
          {clientStatus !== 'countdown' && <InterviewButton />}
        </div>
      </div>
      <AnimatePresence>
        {clientStatus === 'countdown' && <Countdown />}
      </AnimatePresence>
    </div>
  );
};

export default InterviewClient;
