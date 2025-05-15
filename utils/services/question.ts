import { cookies } from 'next/headers';
import { fetcher } from './fetcher';
import {
  BookmarkedQuestionType,
  InterviewSessionType,
  QuestionCountType,
  QuestionType,
  RoleType,
  UserQuestionType,
} from '../types/types';

export const getUserCreatedQuestions = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  const options: Partial<RequestInit> = {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `accessToken=${token}`,
    },
  };

  const data = fetcher<UserQuestionType[]>(`/question/user`, options);

  return data;
};

export const getBookmarkedQuestions = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  const options: Partial<RequestInit> = {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `accessToken=${token}`,
    },
  };

  const data = fetcher<BookmarkedQuestionType[]>(`/question/bookmark`, options);

  return data;
};

export const getAiGeneratedQuestions = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  const options: Partial<RequestInit> = {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `accessToken=${token}`,
    },
  };

  const data = fetcher<UserQuestionType[]>(`/question/ai`, options);

  return data;
};

export const getQuestionList = async () => {
  const data = fetcher<QuestionType[]>(`/question`);

  return data;
};

export const getQuestionListByRole = async (role: RoleType) => {
  const data = fetcher<QuestionType[]>(`/question?role=${role}`);

  return data;
};

export const getQuestionCounts = async () => {
  return fetcher<QuestionCountType>(`/question/count`);
};

export const getInterviewSession = async (sessionId: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  const options: Partial<RequestInit> = {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `accessToken=${token}`,
    },
  };

  const data = fetcher<InterviewSessionType>(
    `/interview/session/${sessionId}`,
    options,
  );

  return data;
};
