import styles from '../../_styles/page.module.css';
import SidebarServer from '@/components/select/sidebar/SidebarServer';
import UserQuestionListServer from '@/components/select/container/userCreatedQuestion/UserCreatedQuestionListServer';
import { Suspense } from 'react';
import UserCreatedQuestionListHeaderClient from '@/components/select/listHeader/UserCreatedQuestionListHeaderClient';

const UserSelectPage = async () => {
  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <div className={styles.tableOptionsContainer}>
          <SidebarServer />
        </div>
        <div className={styles.questionListContainer}>
          <UserCreatedQuestionListHeaderClient />
          <Suspense>
            <UserQuestionListServer />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default UserSelectPage;
