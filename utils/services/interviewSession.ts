import { QuestionSection } from '../types/types';

interface StartSessionRes {
  message: string;
  question: {
    question_id: string;
    question_text: string;
    section: QuestionSection;
  };
  current_order: number;
  total_questions: number;
}

interface SubmitAnswerRes {
  message: string;
  is_last: false;
  question?: {
    question_id: string;
    question_text: string;
    section: QuestionSection;
  };
  current_order?: number;
}

export const startInterviewSession = async (
  sessionId: string,
): Promise<StartSessionRes> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session/start`, {
    method: 'PATCH',
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ session_id: sessionId }),
  });

  if (!res.ok) {
    throw new Error('start 세팅에 실패했습니다.');
  }

  const data: StartSessionRes = await res.json();

  return data;
};

export const startAnswering = async (sessionId: string, questionId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/answer/start`, {
    method: 'PATCH',
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ session_id: sessionId, question_id: questionId }),
  });

  if (!res.ok) {
    throw new Error('answer start에 실패했습니다.');
  }
};

export const submitAnswerData = async (
  sessionId: string,
  questionId: string,
  audioBlob: Blob,
  answerText: string,
): Promise<SubmitAnswerRes> => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'answer.webm');
  formData.append('session_id', sessionId);
  formData.append('question_id', questionId);
  formData.append('answer_text', answerText);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/answer/submit`, {
    method: 'PATCH',
    credentials: 'include',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('submit 세팅에 실패했습니다.');
  }

  const data: SubmitAnswerRes = await res.json();
  return data;
};

export const completeInterviewSession = async (sessionId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/session/complete`,
    {
      method: 'PATCH',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: sessionId }),
    },
  );

  if (!res.ok) {
    throw new Error('complete 세팅에 실패했습니다.');
  }
};
