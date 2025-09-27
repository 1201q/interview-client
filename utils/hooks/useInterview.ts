import { useTranscribe } from '@/utils/hooks/useTranscribe';

import {
  getInterviewSessionDetail,
  startAnswer,
  startInterviewSession,
  submitAnswer,
} from '@/utils/services/interviewSession';
import {
  InterviewPhase,
  InterviewSessionStatus,
  QSessionQuestionItem,
} from '@/utils/types/interview';

import { useState } from 'react';

interface InterviewInitProps {
  sessionId: string;
  questions: QSessionQuestionItem[];
  status: InterviewSessionStatus;
}

export const useInterview = ({
  questions,
  sessionId,
  status,
}: InterviewInitProps) => {
  const [clientQuestions, setClientQuestions] = useState(questions);
  const currentQuestion = clientQuestions.find(
    (q) => q.status === 'ready' || q.status === 'answering',
  );

  const [serverStatus, setServerStatus] = useState(status);
  const [clientPhase, setClientPhase] = useState<InterviewPhase>('beforeStart');

  const {
    connected,
    isRecording,
    canResume,
    stable,
    live,
    rawLiveData,
    rawStableData,
    flushAndStop,
    resumeTranscription,
    connectTranscription,
    prepareAudioTrack,
    resetText,
  } = useTranscribe({
    onEvent: (e: any) => {},
  });

  const doStartSession = async () => {
    try {
      setClientPhase('beforeStartLoading');
      await startInterviewSession(sessionId);
      refresh();

      setClientPhase('start');
    } catch (error) {
      setClientPhase('beforeStart');
    }
  };

  const refresh = async () => {
    const res = await getInterviewSessionDetail(sessionId);

    setClientQuestions(res.questions);
    setServerStatus(res.status);
  };

  const doStartCountdown = async () => {
    if (!currentQuestion) return;

    try {
      setClientPhase('starting');
      // 1. 컨텍스트와 함께 토큰 발급

      await connectTranscription({});

      // 2. 오디오 소스 준비

      await prepareAudioTrack('mic');

      // 3. 현재 질문을 answering으로 변경 -> 성공시 카운트 다운

      await startAnswer(sessionId, currentQuestion.id);

      setClientPhase('startCountdown3');
    } catch (error) {
      setClientPhase('start');
    }
  };

  const doStartAnswer = async () => {
    resumeTranscription();
    setClientPhase('answering');

    refresh();
  };

  const doSubmitAnswer = async () => {
    if (!currentQuestion) return;

    try {
      setClientPhase('submitting');

      const data = await flushAndStop();
      const result = await submitAnswer({
        sessionId: sessionId,
        sqId: currentQuestion.id,
        audioBlob: data.audioBlob,
        answerText: data.text,
      });

      if (!result.finished) {
        refresh();
        setClientPhase('submitSuccess');

        setTimeout(() => setClientPhase('start'), 1200);
      } else {
        refresh();
        setClientPhase('end');
      }
    } catch (error) {
      setClientPhase('answering');
    }
  };

  return {
    currentQuestion,
    clientQuestions,
    clientPhase,
    doStartSession,
    doStartAnswer,
    doStartCountdown,
    doSubmitAnswer,
  };
};
