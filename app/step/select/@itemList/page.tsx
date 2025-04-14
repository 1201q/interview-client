import styles from './page.module.css';
import Sidebar from '@/components/select/sidebar/Sidebar';
import QuestionListHeaderServer from '@/components/select/listHeader/QuestionListHeaderServer';
import { RoleType } from '@/utils/types/types';
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import QuestionListClient from '@/components/select/container/QuestionListClient';
import { getQuestionListByRole } from '@/utils/services/question';

type Props = {
  searchParams: Promise<{ [key: string]: RoleType }>;
};

const ListPage = async ({ searchParams }: Props) => {
  const { role } = await searchParams;
  const roleType = role || 'fe';

  const data = await getQuestionListByRole(roleType);
  const isLoggedIn = (await cookies()).has('accessToken');

  return <QuestionListClient initData={data} isLoggedIn={isLoggedIn} />;
};

export default ListPage;
