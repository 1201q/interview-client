import { QuestionType, RoleType } from '@/utils/types/types';
import QuestionListClient from './CategoryQuestionListClient';
import { cookies } from 'next/headers';

const CategoryQuestionListServer = async ({ role }: { role: RoleType }) => {
  const data = await getQuestionListByRole(role);
  const isLoggedIn = (await cookies()).has('accessToken');

  return <QuestionListClient initData={data} isLoggedIn={isLoggedIn} />;
};

const getQuestionListByRole = async (role: RoleType) => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/question?role=${role}`,
  );
  const res: QuestionType[] = await data.json();

  return res;
};

export default CategoryQuestionListServer;
