import { InterviewSessionType } from '../types/types';
import { fetcher } from './fetcher';

export const startInterviewSession = async (sessionId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/interview/session/start`,
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
    throw new Error('start 세팅에 실패했습니다.');
  }
};

export const completeInterviewSession = async (sessionId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/interview/session/complete`,
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

export const submitInterviewSessionQuestion = async (
  sessionId: string,
  order: number,
  audioBlob: Blob,
) => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'answer.webm');
  formData.append('session_id', sessionId);
  formData.append('order', order.toString());

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/interview/session/question/submit`,
    {
      method: 'PATCH',
      credentials: 'include',
      body: formData,
    },
  );

  if (!res.ok) {
    throw new Error('submit 세팅에 실패했습니다.');
  }

  const isLast: { isLast: boolean } = await res.json();

  return isLast;
};

export const startInterviewSessionQuestion = async (
  sessionId: string,
  order: number,
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/interview/session/question/start`,
    {
      method: 'PATCH',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: sessionId, order: order }),
    },
  );

  if (!res.ok) {
    throw new Error('submit 세팅에 실패했습니다.');
  }
};

export const getInterviewSession = async (sessionId: string) => {
  const options: Partial<RequestInit> = {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const data = fetcher<InterviewSessionType>(
    `/interview/session/${sessionId}`,
    options,
  );

  return data;
};
