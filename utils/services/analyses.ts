import {
  AnalysesListDto,
  AnalysesResultDto,
  AnalysesStatusesDto,
} from '../types/analysis';
import { fetchWithTimeout } from '../libs/fetch';

export const getAnalysis = async (
  sessionId: string,
  answerId: string,
  options?: { timeoutMs?: number },
) => {
  return fetchWithTimeout<AnalysesResultDto>(
    `/analysis/${sessionId}/${answerId}/result`,
    {
      timeoutMs: options?.timeoutMs,
    },
  );
};

export const getAnalyesStatuses = async (
  sessionId: string,
  options?: { timeoutMs?: number },
) => {
  return fetchWithTimeout<AnalysesStatusesDto>(
    `/analysis/${sessionId}/statuses`,
    {
      withCookie: true,
      timeoutMs: options?.timeoutMs,
    },
  );
};

export const getAnalysesList = async (options?: { timeoutMs?: number }) => {
  return fetchWithTimeout<{ results: AnalysesListDto[] }>(
    `/analysis/results/list`,
    {
      withCookie: true,
      timeoutMs: options?.timeoutMs,
    },
  );
};
