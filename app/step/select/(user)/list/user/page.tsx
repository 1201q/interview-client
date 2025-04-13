import styles from '../../_styles/page.module.css';
import SidebarServer from '@/components/select/sidebar/SidebarServer';
import { Suspense } from 'react';
import UserCreatedQuestionListHeaderClient from '@/components/select/listHeader/UserCreatedQuestionListHeaderClient';
import UserCreatedQuestionListClient from '@/components/select/container/userCreatedQuestion/UserCreatedQuestionListClient';
import { getUserCreatedQuestions } from '@/utils/services/question';

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

export default UserSelectPage;
