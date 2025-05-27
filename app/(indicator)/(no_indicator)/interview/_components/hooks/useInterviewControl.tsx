import { interviewClientStatusAtom } from '@/store/interview';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { useInterviewRecorder } from './useInterviewRecorder';
import { useRouter } from 'next/navigation';
import { currentQuestionAtom } from '@/store/interview';
import { totalQuestionsAtom } from '@/store/interview';
import { interviewSessionIdAtom } from '@/store/interview';
import {
  completeInterviewSession,
  startAnswering,
  startInterviewSession,
  submitAnswerData,
} from '@/utils/services/interviewSession';

export const useInterviewControl = (
  recorder: ReturnType<typeof useInterviewRecorder>,
) => {
  const router = useRouter();

  const sessionId = useAtomValue(interviewSessionIdAtom);
  const [currentQuestion, setCurrentQuestion] = useAtom(currentQuestionAtom);
  const setTotalQuestionsAtom = useSetAtom(totalQuestionsAtom);

  const [clientStatus, setClientStatus] = useAtom(interviewClientStatusAtom);
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    try {
      setLoading(true);

      if (sessionId) {
        const data = await startInterviewSession(sessionId);

        setCurrentQuestion({
          question_id: data.question.question_id,
          question_text: data.question.question_text,
          question_order: data.current_order,
        });
        setTotalQuestionsAtom(data.total_questions);
        setClientStatus('waiting30');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error. start:', error);
    }
  };

  const completeInterview = async () => {
    try {
      setLoading(true);

      if (sessionId) {
        await completeInterviewSession(sessionId);

        router.replace(`/result/${sessionId}`);

        setLoading(false);
      }
    } catch (error) {
      console.error('Error. start:', error);
    }
  };

  const startAnswer = async () => {
    setLoading(true);

    try {
      if (currentQuestion && sessionId) {
        await startAnswering(sessionId, currentQuestion.question_id);

        await recorder.startRecording();

        setLoading(false);
      }
    } catch (error) {
      console.error('Error. starting:', error);
    }
  };

  const submitAnswer = async () => {
    try {
      setLoading(true);
      if (sessionId) {
        const audioBlob = await recorder.stopRecording();

        if (sessionId && currentQuestion) {
          const result = await submitAnswerData(
            sessionId,
            currentQuestion?.question_id,
            audioBlob,
          );

          if (result.is_last) {
            setClientStatus('end');
            return;
          }

          if (result.question && result.current_order) {
            setCurrentQuestion({
              question_id: result.question.question_id,
              question_text: result.question.question_text,
              question_order: result.current_order,
            });
          }
        }
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
