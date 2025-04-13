import { cookies } from 'next/headers';
import NeedLogin from '../need-login';
import DeleteQuestionHeaderClient from '@/components/select/listHeader/DeleteQuestionHeaderClient';
import UserDeletedQuestionListServer from '@/components/select/container/userDeletedQuestion/UserDeletedQuestionListServer';
import { deleteUserQuestions } from '@/utils/actions/deleteUserQuestions';

const Page = async () => {
  const token = (await cookies()).get('accessToken')?.value;

  if (!token) {
    return <NeedLogin />;
  }

  const submitAction = async (questions: string[]) => {
    'use server';
    const success = await deleteUserQuestions(token, questions);
    return success;
  };

  return (
    <DeleteQuestionHeaderClient submitAction={submitAction}>
      <UserDeletedQuestionListServer />
    </DeleteQuestionHeaderClient>
  );
};

export default Page;
