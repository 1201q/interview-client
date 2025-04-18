import { getBookmarkedQuestions } from '@/utils/services/question';
import styles from '../../../_styles/page.module.css';
import Sidebar from '@/components/select/sidebar/Sidebar';
import { cookies } from 'next/headers';
import BookmarkedQuestionListHeader from '@/components/select/listHeader/BookmarkedQuestionListHeader';
import { Suspense } from 'react';
import ItemList from '@/components/select/ItemList';
import SelectableQuestionItem from '@/components/select/item/SelectableQuestionItem';
import ListLoader from '@/components/select/ListLoader';

const FavoriteSelectPage = async () => {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('accessToken');

  const bookmarkData = isLoggedIn ? await getBookmarkedQuestions() : [];

  return (
    <div className={styles.container}>
      <div className={styles.contentsContainer}>
        <div className={styles.sideMenuContainer}>
          <Sidebar />
        </div>
        <div className={styles.listContainer}>
          <BookmarkedQuestionListHeader />

          <Suspense fallback={<ListLoader />}>
            <ItemList
              data={bookmarkData}
              renderItem={(item) => (
                <SelectableQuestionItem
                  isBookmarked={true}
                  data={item['question']}
                  key={item.id}
                  displayRightContainer={false}
                />
              )}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default FavoriteSelectPage;
