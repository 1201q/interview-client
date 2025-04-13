import { cookies } from 'next/headers';
import NeedLogin from '../need-login';
import DeleteQuestionHeaderClient from '@/components/select/listHeader/DeleteQuestionHeaderClient';

import { UserQuestionType } from '@/utils/types/types';
import UserDeletedQuestionListClient from '@/components/select/container/userDeletedQuestion/UserDeletedQuestionListClient';

const Page = async () => {
  const token = (await cookies()).get('accessToken')?.value;
  if (!token) return <NeedLogin />;

  const data = await getUserCreatedQuestions();

  return (
    <DeleteQuestionHeaderClient>
      <UserDeletedQuestionListClient initData={data} />
    </DeleteQuestionHeaderClient>
  );
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

export default Page;
