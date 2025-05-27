import { InterviewSessionType } from '../types/types';
import { fetcher } from './fetcher';

export const getAudio = async (questionId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/audio/${questionId}`,
    {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    },
  );

  if (!res.ok) throw new Error('Failed to fetch audio');

  const data = await res.blob();

  return data;
};
