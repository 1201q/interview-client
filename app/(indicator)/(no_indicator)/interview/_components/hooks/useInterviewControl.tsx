import {
  displayInterviewQuestionAtom,
  fetchInerviewSessionAtom,
  interviewClientStatusAtom,
  interviewSessionAtom,
} from '@/store/interview';
import {
  startInterviewSession,
  startInterviewSessionQuestion,
  submitInterviewSessionQuestion,
} from '@/utils/services/interview';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';

export const useInterviewControl = () => {
  const session = useAtomValue(interviewSessionAtom);
  const displayQuestion = useAtomValue(displayInterviewQuestionAtom);

  const fetchSessionData = useSetAtom(fetchInerviewSessionAtom);
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

  const startAnswer = async () => {
    setLoading(true);

    try {
      if (session) {
        await startInterviewSessionQuestion(session.id, displayQuestion.order);

        fetchSessionData();
      }
    } catch (error) {
      console.error('Error. starting:', error);
    } finally {
      setLoading(false);
      setClientStatus('countdown');
    }
  };

  const submitAnswer = async () => {
    try {
      setLoading(true);

      if (session) {
        await submitInterviewSessionQuestion(session.id, displayQuestion.order);

        fetchSessionData();
      }
    } catch (error) {
      console.error('Error. starting:', error);
    } finally {
      setLoading(false);
      setClientStatus('waiting30');
    }
  };

  return { loading, startInterview, startAnswer, submitAnswer };
};
