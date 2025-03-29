import { QuestionType } from '@/utils/types/types';
import QuestionListClient from './QuestionListClient';

const QuestionListServer = async () => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/oracledb`);
  const res: QuestionType[] = await data.json();

  console.log(res);

  return <QuestionListClient initData={res} />;
};

export default QuestionListServer;
