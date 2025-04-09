import { cookies } from 'next/headers';
import NeedLogin from '../need-login';
import AddPageHeaderClient from '@/components/select/AddPageHeaderClient';

interface SubmitQuestions {
  question_text: string;
  role: 'user';
}

const Page = async () => {
  const token = (await cookies()).get('accessToken')?.value;

  if (!token) {
    return <NeedLogin />;
  }

  const createUserQuestions = async (question: SubmitQuestions[]) => {
    'use server';

    try {
      const response = await fetch(
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

      if (!response.ok) {
        throw new Error('로그아웃에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return <AddPageHeaderClient createUserQuestions={createUserQuestions} />;
};

export default Page;
