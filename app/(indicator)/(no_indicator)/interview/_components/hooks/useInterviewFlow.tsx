import { interviewClientStatusAtom } from '@/store/interview';
import { useAtom } from 'jotai';
import { useInterviewControl } from './useInterviewControl';
import { useEffect } from 'react';
import { startTimer } from '@/utils/time/timer';

interface Props {
  readySec?: number;
  interviewSec?: number;
}

export const useInterviewFlow = ({
  readySec = 30,
  interviewSec = 60,
}: Props) => {
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
      startAnswer();
      const timer = startTimer(interviewSec, async () => {
        await submitAnswer();
      });
      return () => timer.cancel();
    }
  }, [clientStatus]);

  useEffect(() => {
    if (clientStatus === 'waiting30') {
      const timer = startTimer(readySec, () => {
        setClientStatus('countdown');
      });

      return () => timer.cancel();
    }
  }, [clientStatus]);
};
