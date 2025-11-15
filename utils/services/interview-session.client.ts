import { fetchWithTimeoutClient } from '../libs/fetchClient';
import {
  InterviewSessionStatus,
  SessionQuestionItemWithAnswerId,
} from '../types/interview';

type SessionDetailResponse = {
  session_id: string;
  status: InterviewSessionStatus;
  created_at: string;
  questions: SessionQuestionItemWithAnswerId[];
};

export const getInterviewSessionDetailClient = async (
  sessionId: string,
  options?: { timeoutMs?: number },
) => {
  return fetchWithTimeoutClient<SessionDetailResponse>(
    `/interview-session/${sessionId}`,
    {
      timeoutMs: options?.timeoutMs,
      withCredentials: true,
    },
  );
};
