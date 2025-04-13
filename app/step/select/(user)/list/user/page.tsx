import styles from '../../_styles/page.module.css';
import SidebarServer from '@/components/select/sidebar/SidebarServer';
import { Suspense } from 'react';
import UserCreatedQuestionListHeaderClient from '@/components/select/listHeader/UserCreatedQuestionListHeaderClient';
import { cookies } from 'next/headers';
import { UserQuestionType } from '@/utils/types/types';
import UserCreatedQuestionListClient from '@/components/select/container/userCreatedQuestion/UserCreatedQuestionListClient';

const UserSelectPage = async () => {
  const data = await getUserCreatedQuestions();

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <div className={styles.tableOptionsContainer}>
          <SidebarServer />
        </div>
        <div className={styles.questionListContainer}>
          <UserCreatedQuestionListHeaderClient />
          <Suspense>
            <UserCreatedQuestionListClient initData={data} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

const getUserCreatedQuestions = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question/user`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `accessToken=${token}`,
    },
  });

  const res: UserQuestionType[] = await data.json();

  return res;
};

export default UserSelectPage;
