import { QuestionType } from '@/utils/types/types';
import QuestionListClient from './QuestionListClient';
import { headers } from 'next/headers';

const QuestionListServer = async () => {
  const header = await headers();
  const role = header.get('x-role') || 'fe';

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/oracledb?role=${role}`,
  );
  const res: QuestionType[] = await data.json();

  return <QuestionListClient initData={res} />;
};

export default QuestionListServer;
