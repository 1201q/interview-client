import {
  displayInterviewQuestionAtom,
  fetchInerviewSessionAtom,
  interviewClientStatusAtom,
  interviewSessionAtom,
  isLastQuestionAtom,
} from '@/store/interview';
import {
  completeInterviewSession,
  startInterviewSession,
  startInterviewSessionQuestion,
  submitInterviewSessionQuestion,
} from '@/utils/services/interview';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { useInterviewRecorder } from './useInterviewRecorder';
import { useRouter } from 'next/navigation';

export const useInterviewControl = (
  recorder: ReturnType<typeof useInterviewRecorder>,
) => {
  const router = useRouter();
  const session = useAtomValue(interviewSessionAtom);
  const displayQuestion = useAtomValue(displayInterviewQuestionAtom);

  const fetchSessionData = useSetAtom(fetchInerviewSessionAtom);
  const setIsLastQuestion = useSetAtom(isLastQuestionAtom);
  const [clientStatus, setClientStatus] = useAtom(interviewClientStatusAtom);
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    try {
      setLoading(true);

      if (session) {
        await startInterviewSession(session.id);
        fetchSessionData();
      }
    } catch (error) {
      console.error('Error. start:', error);
    } finally {
      setLoading(false);
      setClientStatus('waiting30');
    }
  };

  const completeInterview = async () => {
    try {
      setLoading(true);

      if (session) {
        await completeInterviewSession(session.id);
        fetchSessionData();
      }
    } catch (error) {
      console.error('Error. start:', error);
    } finally {
      setLoading(false);
      router.replace('/');
    }
  };

  const startAnswer = async () => {
    setLoading(true);

    try {
      if (session) {
        await startInterviewSessionQuestion(session.id, displayQuestion.order);
        await recorder.startRecording();

        fetchSessionData();
      }
    } catch (error) {
      console.error('Error. starting:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    setLoading(true);
    try {
      if (session) {
        const audioBlob = await recorder.stopRecording();

        const result = await submitInterviewSessionQuestion(
          session.id,
          displayQuestion.order,
          audioBlob,
        );

        if (result.isLast) {
          setIsLastQuestion(true);
        }

        fetchSessionData();
      }

      if (clientStatus !== 'answering') return;

      setClientStatus('waiting30');
    } catch (error) {
      console.error('Error. starting:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    startInterview,
    completeInterview,
    startAnswer,
    submitAnswer,
  };
};
