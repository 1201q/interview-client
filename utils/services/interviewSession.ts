import {
  InterviewSessionStatus,
  QSessionQuestionItem,
} from '../types/interview';

// create
type CreateSessionBody = {
  request_id: string;
  questions: { question_id: string; order: number }[];
};

type CreateSessionResponse = {
  id: string;
  status: InterviewSessionStatus;
};

export const createInterviewSession = async (
  requestId: string,
  questions: { question_id: string; order: number }[],
  options?: { timeoutMs?: number },
) => {
  const uniqueCheck = new Map<string, { question_id: string; order: number }>();

  for (const q of questions) {
    if (!uniqueCheck.has(q.question_id)) {
      uniqueCheck.set(q.question_id, q);
    }
  }

  const sorted = [...uniqueCheck.values()].sort((a, b) => a.order - b.order);

  const body: CreateSessionBody = { request_id: requestId, questions: sorted };

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options?.timeoutMs ?? 15000,
  );

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/interview-session/create`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      let error = '';

      try {
        error = await res.text();
      } catch {
        throw new Error(`세션 생성 실패: ${res.status}${error ? error : ''}`);
      }
    }

    const json = (await res.json()) as CreateSessionResponse;

    if (!json.id) throw new Error('세션 응답에 id가 없음.');

    return json;
  } catch (error) {
    if ((error as any)?.name === 'AbortError') {
      throw new Error('세션 생성 요청이 시간 초과되었습니다.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

// jobRole
type CreateJobRoleResponse = {
  job_role: string;
  status: 'completed' | 'failed';
};

export const createInterviewJobRole = async (
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
      `${process.env.NEXT_PUBLIC_API_URL}/interview-session/${sessionId}/role`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      let error = '';

      try {
        error = await res.text();
      } catch {
        throw new Error(`직군 생성 실패: ${res.status}${error ? error : ''}`);
      }
    }

    const json = (await res.json()) as CreateJobRoleResponse;

    if (json.status === 'failed') throw new Error('직군이 미존재.');

    return json;
  } catch (error) {
    if ((error as any)?.name === 'AbortError') {
      throw new Error('세션 생성 요청이 시간 초과되었습니다.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

// keywords
type CreateSttKeywordsResponse = {
  keywords: { id: string; stt_keywords: string[] }[];
};

export const createInterviewSttKeywords = async (
  sessionId: string,
  options?: { timeoutMs?: number },
) => {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options?.timeoutMs ?? 60000,
  );

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/interview-session/${sessionId}/keywords`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      let error = '';

      try {
        error = await res.text();
      } catch {
        throw new Error(
          `keywords 생성 실패: ${res.status}${error ? error : ''}`,
        );
      }
    }

    const json = (await res.json()) as CreateSttKeywordsResponse;

    if (!json.keywords) throw new Error('세션 응답에 keywords가 없음.');

    return json;
  } catch (error) {
    if ((error as any)?.name === 'AbortError') {
      throw new Error('세션 생성 요청이 시간 초과되었습니다.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

// session data

type GetSessionDetailResponse = {
  id: string;
  status: InterviewSessionStatus;
  created_at: string;
  questions: QSessionQuestionItem[];
};

export const getInterviewSessionDetail = async (
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
      `${process.env.NEXT_PUBLIC_API_URL}/interview-session/${sessionId}`,
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
      const err = new Error(`detail get 실패: ${res.status} ${body}`);
      (err as any).status = res.status;
      throw err;
    }

    const json = (await res.json()) as GetSessionDetailResponse;

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

// session start
type StartSessionResponse = {
  id: string;
  status: InterviewSessionStatus;
};

export const startInterviewSession = async (
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
      `${process.env.NEXT_PUBLIC_API_URL}/interview-session/${sessionId}/start`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      let error = '';

      try {
        error = await res.text();
      } catch {
        throw new Error(
          `SESSION start 실패: ${res.status}${error ? error : ''}`,
        );
      }
    }

    const json = (await res.json()) as StartSessionResponse;

    if (json.status !== 'in_progress') {
      throw new Error('시작 실패');
    }

    return json;
  } catch (error) {
    if ((error as any)?.name === 'AbortError') {
      throw new Error('세션 시작 요청이 시간 초과되었습니다.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

// answer start

export const startAnswer = async (
  sessionId: string,
  sqId: string,
  options?: { timeoutMs?: number },
) => {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options?.timeoutMs ?? 15000,
  );

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/interview-answer/${sessionId}/${sqId}/start`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      let error = '';

      try {
        error = await res.text();
      } catch {
        throw new Error(
          `answer start 실패: ${res.status}${error ? error : ''}`,
        );
      }
    }
  } catch (error) {
    if ((error as any)?.name === 'AbortError') {
      throw new Error('답변 시작 요청이 시간 초과되었습니다.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

// reset
type ResetSessionResponse = {
  id: string;
  status: InterviewSessionStatus;
};

export const resetInterviewSession = async (
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
      `${process.env.NEXT_PUBLIC_API_URL}/interview-session/${sessionId}/reset`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      let error = '';

      try {
        error = await res.text();
      } catch {
        throw new Error(`reset 실패: ${res.status}${error ? error : ''}`);
      }
    }

    return (await res.json()) as ResetSessionResponse;
  } catch (error) {
    if ((error as any)?.name === 'AbortError') {
      throw new Error('reset 요청이 시간 초과되었습니다.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

// test submit
type NextAnswer = {
  questionId: string;
  order: number;
  text: string;
  type: 'main' | 'followup';
};

type SubmitAnswerRes = {
  next: null | NextAnswer;
  finished: boolean;
};

type SubmitAnswerProps = {
  sessionId: string;
  sqId: string;
  audioBlob: Blob | null;
  answerText: string;
  options?: { timeoutMs?: number };
};

export const testSubmitAnswer = async (
  sessionId: string,
  sqId: string,
  options?: { timeoutMs?: number },
) => {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options?.timeoutMs ?? 15000,
  );

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/interview-answer/${sessionId}/${sqId}/submit/test`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      let error = '';

      try {
        error = await res.text();
      } catch {
        throw new Error(
          `answer submit 실패: ${res.status}${error ? error : ''}`,
        );
      }
    }

    return (await res.json()) as SubmitAnswerRes;
  } catch (error) {
    if ((error as any)?.name === 'AbortError') {
      throw new Error('answer submit  요청이 시간 초과되었습니다.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export const submitAnswer = async ({
  sessionId,
  sqId,
  audioBlob,
  options,
  answerText,
}: SubmitAnswerProps) => {
  const form = new FormData();

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options?.timeoutMs ?? 15000,
  );

  if (audioBlob) {
    const file = new File([audioBlob], `answer-${Date.now()}.webm`, {
      type: audioBlob.type || 'audio/webm',
    });
    form.append('audio', file);
  }
  form.append('answerText', answerText ?? '');

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/interview-answer/${sessionId}/${sqId}/submit/test`,
      {
        method: 'POST',
        signal: controller.signal,
        body: form,
      },
    );

    if (!res.ok) {
      let error = '';

      try {
        error = await res.text();
      } catch {
        throw new Error(
          `answer submit 실패: ${res.status}${error ? error : ''}`,
        );
      }
    }

    return (await res.json()) as SubmitAnswerRes;
  } catch (error) {
    if ((error as any)?.name === 'AbortError') {
      throw new Error('answer submit  요청이 시간 초과되었습니다.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
