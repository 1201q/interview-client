import { fetchWithTimeout } from '../libs/fetch';
import { GeneratedQuestionItem } from '../types/types';

export type RequestStatus = 'pending' | 'working' | 'completed' | 'failed';

export type RequestListItem = {
  request_id: string;
  status: RequestStatus;
  questions_count: number;
  created_at: string;
  updated_at: string;
  session_count: number;
  last_session_at: string | null;
};

export const getRequestQuestions = async (
  requestId: string,
  options?: { timeoutMs?: number },
) => {
  return fetchWithTimeout<{ questions: GeneratedQuestionItem[] }>(
    `/generate-question/${requestId}/questions`,
    { withCookie: true, timeoutMs: options?.timeoutMs },
  );
};

export const getRequestStatus = async (
  requestId: string,
  options?: { timeoutMs?: number },
) => {
  return fetchWithTimeout<{
    request_id: string;
    status: RequestStatus;
  }>(`/generate-question/${requestId}/request`, {
    withCookie: true,
    timeoutMs: options?.timeoutMs,
  });
};

export const getRequestsList = async (options?: { timeoutMs?: number }) => {
  return fetchWithTimeout<{ results: RequestListItem[] }>(
    `/generate-question/requests/list`,
    {
      withCookie: true,
      timeoutMs: options?.timeoutMs,
    },
  );
};
