import styles from '../../_styles/page.module.css';
import SidebarServer from '@/components/select/sidebar/SidebarServer';
import UserQuestionListServer from '@/components/select/container/userCreatedQuestion/UserCreatedQuestionListServer';
import { Suspense } from 'react';
import UserCreatedQuestionListHeaderClient from '@/components/select/listHeader/UserCreatedQuestionListHeaderClient';
import { cookies } from 'next/headers';
import { deleteUserQuestions } from '@/utils/actions/deleteUserQuestions';

const UserSelectPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  const handleDeleteSubmit = async (items: string[]) => {
    'use server';
    if (!token) return;

    deleteUserQuestions(token, items);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <div className={styles.tableOptionsContainer}>
          <SidebarServer />
        </div>
        <div className={styles.questionListContainer}>
          <UserCreatedQuestionListHeaderClient
            handleDeleteSubmit={handleDeleteSubmit}
          />
          <Suspense>
            <UserQuestionListServer />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default UserSelectPage;
