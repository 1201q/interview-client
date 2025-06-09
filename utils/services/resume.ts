import { QuestionDataArray } from '../types/types';
import { fetcher } from './fetcher';

export const getGeneratedQuestions = async (id: string) => {
  const options: Partial<RequestInit> = {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const data = fetcher<{ questions: QuestionDataArray[] }>(
    `/question/generate/${id}`,
    options,
  );

  return data;
};
