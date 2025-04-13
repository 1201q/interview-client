import { cookies } from 'next/headers';
import NeedLogin from '../need-login';
import AddQuestionHeaderClient from '@/components/select/listHeader/AddQuestionHeaderClient';

interface SubmitQuestions {
  question_text: string;
  role: 'user';
}

const Page = async () => {
  const token = (await cookies()).get('accessToken')?.value;

  if (!token) return <NeedLogin />;

  return <AddQuestionHeaderClient />;
};

export default Page;
