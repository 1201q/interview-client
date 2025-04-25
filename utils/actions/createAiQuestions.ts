'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const createAiQuestions = async (questions: string[]) => {
  const token = (await cookies()).get('accessToken')?.value;
  if (!token) throw new Error('Unauthorized');

  const submitData = questions.map((q) => {
    return {
      question_text: q,
      role: 'ai',
    };
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/question/add/ai`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${token}`,
      },
      body: JSON.stringify({ items: submitData }),
    },
  );

  if (!res.ok) {
    throw new Error('로그아웃에 실패했습니다.');
  }

  revalidatePath('/question_select');
};
