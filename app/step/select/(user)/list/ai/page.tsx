import styles from '../../_styles/page.module.css';
import SidebarServer from '@/components/select/sidebar/SidebarServer';
import QuestionListHeaderServer from '@/components/select/listHeader/QuestionListHeaderServer';
import UserQuestionListServer from '@/components/select/container/userCreatedQuestion/UserCreatedQuestionListServer';
import { Suspense } from 'react';

const AiSelectPage = async () => {
  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <div className={styles.tableOptionsContainer}>
          <SidebarServer />
        </div>
        <div className={styles.questionListContainer}>
          <QuestionListHeaderServer />1
        </div>
      </div>
    </div>
  );
};

export default AiSelectPage;
