import { interviewClientStatusAtom } from '@/store/interview';
import { useAtom } from 'jotai';
import { useInterviewControl } from './useInterviewControl';
import { useEffect } from 'react';
import { startTimer } from '@/utils/time/timer';

interface Props {
  readySec?: number;
  interviewSec?: number;
  control: ReturnType<typeof useInterviewControl>;
}

export const useInterviewFlow = ({
  readySec = 30,
  interviewSec = 60,
  control,
}: Props) => {
  const [clientStatus, setClientStatus] = useAtom(interviewClientStatusAtom);

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
      control.startAnswer();

      const timer = startTimer(interviewSec, async () => {
        await control.submitAnswer();
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
