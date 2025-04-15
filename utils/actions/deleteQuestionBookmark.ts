'use server';

import { cookies } from 'next/headers';

export const deleteQuestionBookmark = async (questionId: string) => {
  const token = (await cookies()).get('accessToken')?.value;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/question/bookmark/delete`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${token}`,
      },
      body: JSON.stringify({ questionId: questionId }),
    },
  );

  if (!res.ok) {
    throw new Error('북마크를 실패했습니다.');
  }
};
