import { InterviewSessionStatus } from '../types/interview';

// create
type CreateSessionBody = {
  request_id: string;
  questions: { question_id: string; order: number }[];
};

type CreateSessionResponse = {
  session_id: string;
};

export const createInterviewSession = async ({
  requestId,
  questions,
  options,
}: {
  requestId: string;
  questions: { question_id: string; order: number }[];
  options?: { timeoutMs?: number };
}) => {
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

    if (!json.session_id) throw new Error('세션 응답에 id가 없음.');

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

// session start
type StartSessionResponse = {
  session_id: string;
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
        credentials: 'include',
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
  answerId: string,
  options?: { timeoutMs?: number },
) => {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options?.timeoutMs ?? 15000,
  );

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/interview-answer/${answerId}/start`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        credentials: 'include',
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
        credentials: 'include',
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
  answerId: string;
};

type SubmitAnswerRes = {
  next: null | NextAnswer;
  finished: boolean;
};

type SubmitAnswerProps = {
  answerId: string;

  audioBlob: Blob | null;
  answerText: string;
  options?: { timeoutMs?: number };
};

export const submitAnswer = async ({
  answerId,
  audioBlob,
  options,
  answerText,
  faceData,
}: SubmitAnswerProps & { faceData: any }) => {
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

  if (faceData) {
    form.append('faceData', JSON.stringify(faceData));
  }

  form.append('answerText', answerText ?? '');

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/interview-answer/${answerId}/submit`,
      {
        method: 'POST',
        signal: controller.signal,
        body: form,
        credentials: 'include',
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

    const json = (await res.json()) as SubmitAnswerRes;

    return json;
  } catch (error) {
    if ((error as any)?.name === 'AbortError') {
      throw new Error('answer submit  요청이 시간 초과되었습니다.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
