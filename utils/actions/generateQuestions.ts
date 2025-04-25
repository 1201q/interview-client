'use server';

import { cookies } from 'next/headers';
import { GeneratedQuestionType } from '../types/types';

export const generateQuestions = async (
  formData: FormData,
  question_type: string,
) => {
  const token = (await cookies()).get('accessToken')?.value;
  if (!token) throw new Error('Unauthorized');

  const jobRole = formData.get('jobRole')?.toString();
  const topic = formData.get('topic')?.toString();

  const submitData = { jobRole, topic, question_type };

  console.log(submitData);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/question/ai/generate`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${token}`,
      },
      body: JSON.stringify(submitData),
    },
  );

  if (!res.ok) {
    throw new Error('질문 생성에 실패했습니다.');
  }

  const data = await res.json();
  const questions: GeneratedQuestionType[] = data.questions;

  return { questions, success: true };
};
