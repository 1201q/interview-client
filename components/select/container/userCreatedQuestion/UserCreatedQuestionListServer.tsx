import { UserQuestionType } from '@/utils/types/types';

import { cookies } from 'next/headers';
import UserQuestionListClient from './UserCreatedQuestionListClient';

const UserCreatedQuestionListServer = async () => {
  const data = await getUserCreatedQuestions();

  return <UserQuestionListClient initData={data} />;
};

const getUserCreatedQuestions = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question/user`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `accessToken=${token}`,
    },
  });

  const res: UserQuestionType[] = await data.json();

  return res;
};

export default UserCreatedQuestionListServer;
