'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const createUserQuestion = async (formData: FormData) => {
  const token = (await cookies()).get('accessToken')?.value;
  const question = formData.get('question')?.toString();

  const submitData = [{ question_text: question, role: 'user' }];

  if (!token) redirect('/login');

  if (!question || question.length < 10) {
    throw new Error('질문을 10자 이상으로 입력해주세요.');
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/question/add/user`,
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
    throw new Error('저장에 실패했습니다.');
  }

  revalidatePath('/question_select');
};
