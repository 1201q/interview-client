import { GenerateStatus } from '../types/analysis';

interface GenerateQuestionPayload {
  resume_text: string;
  job_text: string;
}

export const generateQuestion = async (payload: GenerateQuestionPayload) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/generate-question/create`,
    {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error('생성 실패');
  }

  const data: { request_id: string; status: GenerateStatus } =
    await response.json();

  return data;
};
