import { cookies } from 'next/headers';
import {
  AnalysesListDto,
  AnalysesResultDto,
  AnalysesStatusesDto,
} from '../types/analysis';

export const getAnalysis = async (
  sessionId: string,
  answerId: string,
  options?: { timeoutMs?: number },
) => {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options?.timeoutMs ?? 15000,
  );

  const cookieHeader = (await cookies()).toString();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/analysis/${sessionId}/${answerId}/result`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      let body = '';
      try {
        body = await res.text();
      } catch {}
      const err = new Error(`analysis get 실패: ${res.status} ${body}`);
      (err as any).status = res.status;
      throw err;
    }

    const json = (await res.json()) as AnalysesResultDto;

    return json;
  } catch (error) {
    if ((error as any)?.name === 'AbortError') {
      throw new Error('세션 요청이 시간 초과되었습니다.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export const getAnalyesStatuses = async (
  sessionId: string,
  options?: { timeoutMs?: number },
) => {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options?.timeoutMs ?? 15000,
  );

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/analysis/${sessionId}/statuses`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      let body = '';
      try {
        body = await res.text();
      } catch {}
      const err = new Error(`statuses get 실패: ${res.status} ${body}`);
      (err as any).status = res.status;
      throw err;
    }

    const json = (await res.json()) as AnalysesStatusesDto;

    return json;
  } catch (error) {
    if ((error as any)?.name === 'AbortError') {
      throw new Error('세션 요청이 시간 초과되었습니다.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export const getAnalysesList = async (options?: { timeoutMs?: number }) => {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options?.timeoutMs ?? 15000,
  );

  const cookieHeader = (await cookies()).toString();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/analysis/results/list`,
      {
        method: 'GET',
        headers: { cookie: cookieHeader },
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      let body = '';
      try {
        body = await res.text();
      } catch {}
      const err = new Error(`getAnalysesList get 실패: ${res.status} ${body}`);
      (err as any).status = res.status;
      throw err;
    }

    const json = (await res.json()) as { results: AnalysesListDto[] };

    return json;
  } catch (error) {
    if ((error as any)?.name === 'AbortError') {
      throw new Error('세션 요청이 시간 초과되었습니다.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
