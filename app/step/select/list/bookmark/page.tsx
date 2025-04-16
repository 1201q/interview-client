import { getBookmarkedQuestions } from '@/utils/services/question';
import styles from '../../../_styles/page.module.css';
import Sidebar from '@/components/select/sidebar/Sidebar';
import { cookies } from 'next/headers';

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
          {/* {' '}
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default FavoriteSelectPage;
