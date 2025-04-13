'use server';

interface SubmitQuestions {
  question_text: string;
  role: 'user';
}

import { cookies } from 'next/headers';

export const createUserQuestions = async (question: SubmitQuestions[]) => {
  const token = (await cookies()).get('accessToken')?.value;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/question/add/user`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${token}`,
      },
      body: JSON.stringify({ items: question }),
    },
  );

  if (!res.ok) {
    throw new Error('로그아웃에 실패했습니다.');
  }
};
