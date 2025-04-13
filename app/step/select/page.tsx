import styles from './page.module.css';
import SidebarServer from '@/components/select/sidebar/SidebarServer';
import QuestionListHeaderServer from '@/components/select/listHeader/QuestionListHeaderServer';
import { QuestionType, RoleType } from '@/utils/types/types';
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import CategoryQuestionListClient from '@/components/select/container/categoryQuestion/CategoryQuestionListClient';

type Props = {
  searchParams: Promise<{ [key: string]: RoleType }>;
};

const SelectPage = async ({ searchParams }: Props) => {
  const { role } = await searchParams;
  const roleType = role || 'fe';

  const data = await getQuestionListByRole(role);
  const isLoggedIn = (await cookies()).has('accessToken');

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <div className={styles.tableOptionsContainer}>
          <SidebarServer />
        </div>
        <div className={styles.questionListContainer}>
          <QuestionListHeaderServer />
          <Suspense key={roleType} fallback={<div>loading....</div>}>
            <CategoryQuestionListClient
              initData={data}
              isLoggedIn={isLoggedIn}
            />
            ;
          </Suspense>
        </div>
      </div>
    </div>
  );
};

const getQuestionListByRole = async (role: RoleType) => {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/question?role=${role}`,
  );
  const res: QuestionType[] = await data.json();

  return res;
};

export default SelectPage;
