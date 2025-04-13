import { cookies } from 'next/headers';
import NeedLogin from '../need-login';
import AddQuestionHeaderClient from '@/components/select/listHeader/AddQuestionHeaderClient';
import { createUserQuestions } from '@/utils/actions/createUserQuestions';

interface SubmitQuestions {
  question_text: string;
  role: 'user';
}

const Page = async () => {
  const token = (await cookies()).get('accessToken')?.value;

  if (!token) {
    return <NeedLogin />;
  }

  const serverAction = async (questions: SubmitQuestions[]) => {
    'use server';
    await createUserQuestions(token, questions);
  };

  return <AddQuestionHeaderClient serverAction={serverAction} />;
};

export default Page;
