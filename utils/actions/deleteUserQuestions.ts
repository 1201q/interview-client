'use server';

import { cookies } from 'next/headers';

export const deleteUserQuestions = async (questions: string[]) => {
  if (questions.length === 0) {
    throw new Error('없습니다.');
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/question/delete/user`,
    {
      method: 'POST',
      credentials: 'include',

      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify({ items: questions }),
    },
  );

  if (!response.ok) {
    throw new Error('로그아웃에 실패했습니다.');
  }
};
