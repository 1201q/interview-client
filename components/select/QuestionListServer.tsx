import { QuestionType, RoleType } from '@/utils/types/types';
import QuestionListClient from './QuestionListClient';

const QuestionListServer = async ({ role }: { role: RoleType }) => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/question?role=${role}`,
  );
  const res: QuestionType[] = await data.json();

  return <QuestionListClient initData={res} />;
};

export default QuestionListServer;
