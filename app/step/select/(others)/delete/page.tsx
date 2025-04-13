import { cookies } from 'next/headers';
import NeedLogin from '../need-login';
import DeleteQuestionHeaderClient from '@/components/select/listHeader/DeleteQuestionHeaderClient';
import UserDeletedQuestionListClient from '@/components/select/container/userDeletedQuestion/UserDeletedQuestionListClient';
import { getUserCreatedQuestions } from '@/utils/services/question';

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

export default Page;
