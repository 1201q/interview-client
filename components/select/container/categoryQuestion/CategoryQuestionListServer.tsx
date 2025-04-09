import { QuestionType, RoleType } from '@/utils/types/types';
import QuestionListClient from './CategoryQuestionListClient';

const CategoryQuestionListServer = async ({ role }: { role: RoleType }) => {
  const data = await getQuestionListByRole(role);
  return <QuestionListClient initData={data} />;
};

const getQuestionListByRole = async (role: RoleType) => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/question?role=${role}`,
  );
  const res: QuestionType[] = await data.json();

  return res;
};

export default CategoryQuestionListServer;
