import styles from '../../../_styles/page.module.css';
import Sidebar from '@/components/select/sidebar/Sidebar';
import { Suspense } from 'react';
import UserQuestionListHeader from '@/components/select/listHeader/UserQuestionListHeader';
import { getUserCreatedQuestions } from '@/utils/services/question';
import ItemList from '@/components/select/ItemList';
import UserCreatedQuestionItem from '@/components/select/item/UserCreatedQuestionItem';

const UserSelectPage = async () => {
  const data = await getUserCreatedQuestions();

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <div className={styles.tableOptionsContainer}>
          <Sidebar />
        </div>
        <div className={styles.questionListContainer}>
          <UserQuestionListHeader />
          <Suspense fallback={<div>loading....</div>}>
            <ItemList
              data={data}
              renderItem={(item) => (
                <UserCreatedQuestionItem data={item} key={item.id} />
              )}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default UserSelectPage;
