'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const deleteUserQuestions = async (questions: string[]) => {
  if (questions.length === 0) {
    throw new Error('삭제할 항목이 없습니다.');
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) redirect('/login');

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
    throw new Error('삭제에 실패했습니다.');
  }

  revalidatePath('/question_select');
};
