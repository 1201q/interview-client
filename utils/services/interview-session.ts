import { fetchWithTimeout } from '../libs/fetch';

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

export const getInterviewSessionDetail = async (
  sessionId: string,
  options?: { timeoutMs?: number },
) => {
  return fetchWithTimeout<SessionDetailResponse>(
    `/interview-session/${sessionId}`,
    {
      withCookie: true,
      timeoutMs: options?.timeoutMs,
    },
  );
};
