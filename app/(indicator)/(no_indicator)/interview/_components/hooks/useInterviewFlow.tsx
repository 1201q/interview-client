import {
  interviewClientStatusAtom,
  interviewSessionAtom,
  interviewSessionStatusAtom,
} from '@/store/interview';
import { useAtom, useAtomValue } from 'jotai';
import { useInterviewControl } from './useInterviewControl';
import { useEffect } from 'react';
import { startTimer } from '@/utils/time/timer';

export const useInterviewFlow = () => {
  const sessionStatus = useAtomValue(interviewSessionStatusAtom);
  const [clientStatus, setClientStatus] = useAtom(interviewClientStatusAtom);

  const { startAnswer, submitAnswer } = useInterviewControl();

  useEffect(() => {
    if (clientStatus === 'countdown') {
      const timer = setTimeout(() => {
        setClientStatus('answering');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [clientStatus]);

  useEffect(() => {
    if (clientStatus === 'answering') {
      const timer = startTimer(60, () => {
        submitAnswer();
        setClientStatus('waiting30');
      });

      return () => timer.cancel();
    }
  }, [clientStatus]);

  useEffect(() => {
    if (clientStatus === 'waiting30') {
      const timer = startTimer(30, () => {
        startAnswer();
        setClientStatus('countdown');
      });

      return () => timer.cancel();
    }
  }, [clientStatus]);
};
