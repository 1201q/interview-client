import styles from '../../../_styles/page.module.css';
import Sidebar from '@/components/select/sidebar/Sidebar';
import { Suspense } from 'react';
import UserQuestionListHeader from '@/components/select/listHeader/UserQuestionListHeader';
import {
  getBookmarkedQuestions,
  getUserCreatedQuestions,
} from '@/utils/services/question';
import ItemList from '@/components/select/ItemList';

import SelectableQuestionItem from '@/components/select/item/SelectableQuestionItem';
import { cookies } from 'next/headers';

const UserSelectPage = async () => {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('accessToken');

  const data = await getUserCreatedQuestions();
  const bookmarkData = isLoggedIn ? await getBookmarkedQuestions() : [];

  return (
    <div className={styles.container}>
      <div className={styles.contentsContainer}>
        <div className={styles.sideMenuContainer}>
          <Sidebar />
        </div>
        <div className={styles.listContainer}>
          <UserQuestionListHeader />
          <Suspense fallback={<div>loading....</div>}>
            <ItemList
              data={data}
              renderItem={(item) => (
                <SelectableQuestionItem
                  isBookmarked={
                    bookmarkData.findIndex(
                      (data) => data.question_id === item.id,
                    ) !== -1
                  }
                  data={item}
                  key={item.id}
                  displayRightContainer={true}
                />
              )}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default UserSelectPage;
