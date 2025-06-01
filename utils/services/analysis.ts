import { AnalysisProgress } from '../types/types';

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

export const getAnalysisProgress = async (sessionId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/analysis/progress/${sessionId}`,
    {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    },
  );

  if (!res.ok) throw new Error('Failed to fetch progress');

  const data: AnalysisProgress = await res.json();

  return data;
};
