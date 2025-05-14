'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const createInterviewSession = async (
  questionWithOrder: { id: string; order: number }[],
) => {
  const token = (await cookies()).get('accessToken')?.value;
  if (!token) throw new Error('Unauthorized');

  const submitData = questionWithOrder.map((q) => {
    return {
      id: q.id,
      order: q.order,
    };
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/interview/create_session`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${token}`,
      },
      body: JSON.stringify({ questions: submitData }),
    },
  );

  if (!res.ok) {
    throw new Error('세션 생성에 실패했습니다. 다시 시도해주세요.');
  }

  revalidatePath('/question_select/confirm');
};
