import QuestionListHeader from '@/components/select/listHeader/QuestionListHeader';
import { RoleType } from '@/utils/types/types';
import { Suspense } from 'react';
import { cookies } from 'next/headers';

import {
  getBookmarkedQuestions,
  getQuestionListByRole,
} from '@/utils/services/question';
import Sidebar from '@/components/select/sidebar/Sidebar';
import styles from '../_styles/page.module.css';
import ItemList from '@/components/select/ItemList';
import UserFavoritableQuestionItem from '@/components/select/item/UserFavoritableQuestionItem';
import QuestionItem from '@/components/select/item/QuestionItem';

type Props = {
  searchParams: Promise<{ [key: string]: RoleType }>;
};

const SelectPage = async ({ searchParams }: Props) => {
  const { role } = await searchParams;
  const roleType = role || 'fe';

  const data = await getQuestionListByRole(roleType);
  const bookmarkData = await getBookmarkedQuestions();

  const isLoggedIn = (await cookies()).has('accessToken');

  return (
    <div className={styles.container}>
      <div className={styles.contentsContainer}>
        <div className={styles.sideMenuContainer}>
          <Sidebar />
        </div>
        <div className={styles.listContainer}>
          <QuestionListHeader />
          <Suspense key={roleType} fallback={<div>loading....</div>}>
            {isLoggedIn ? (
              <ItemList
                data={data}
                renderItem={(item) => (
                  <UserFavoritableQuestionItem
                    isBookmarked={
                      bookmarkData.findIndex(
                        (data) => data.question_id === item.id,
                      ) !== -1
                    }
                    data={item}
                    key={item.id}
                  />
                )}
              />
            ) : (
              <ItemList
                data={data}
                renderItem={(item) => (
                  <QuestionItem data={item} key={item.id} />
                )}
              />
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default SelectPage;
