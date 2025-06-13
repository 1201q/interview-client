import {
  currentQuestionAtom,
  interviewClientStatusAtom,
} from '@/store/interview';
import { useAtom } from 'jotai';
import { useInterviewControl } from './useInterviewControl';
import { useEffect } from 'react';
import { startTimer } from '@/utils/time/timer';
import { getInterviewSecBySection } from '@/utils/time/duration';

interface Props {
  readySec?: number;

  control: ReturnType<typeof useInterviewControl>;
}

export const useInterviewFlow = ({ readySec = 30, control }: Props) => {
  const [clientStatus, setClientStatus] = useAtom(interviewClientStatusAtom);
  const [currentQuestion] = useAtom(currentQuestionAtom);

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

      const sec = getInterviewSecBySection(currentQuestion?.section ?? 'basic');

      const timer = startTimer(sec, async () => {
        await control.submitAnswer();
      });

      return () => timer.cancel();
    }
  }, [clientStatus, currentQuestion?.section]);

  useEffect(() => {
    if (clientStatus === 'waiting30') {
      const timer = startTimer(readySec, () => {
        setClientStatus('countdown');
      });

      return () => timer.cancel();
    }
  }, [clientStatus]);
};
