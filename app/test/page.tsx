import {
  getBookmarkedQuestions,
  getQuestionListByRole,
  getUserCreatedQuestions,
} from '@/utils/services/question';
import BottomController from './_components/BottomController';
import Indicator from './_components/Indicator';
import QuestionItem from './_components/QuestionItem';
import SearchInput from './_components/SearchInput';
import styles from './page.module.css';

import {
  BookmarkedQuestionType,
  ExtendedRoleType,
  QuestionType,
} from '@/utils/types/types';
import { Suspense } from 'react';
import ItemList from './_components/ItemList';
import Options from './_components/Options';
import { isRoleType } from '@/utils/types/guard';
import { cookies } from 'next/headers';
import Help from './_components/Help';
import SelectQuestionList from './_components/SelectQuestionList';

type Props = {
  searchParams: Promise<{ [key: string]: ExtendedRoleType }>;
};

const Page = async ({ searchParams }: Props) => {
  const { role } = await searchParams;
  const roleType = role || 'fe';

  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('accessToken');

  const bookmarkData = isLoggedIn ? await getBookmarkedQuestions() : [];

  const getData = async (
    type: ExtendedRoleType,
  ): Promise<QuestionType[] | BookmarkedQuestionType[]> => {
    if (isRoleType(type)) {
      return getQuestionListByRole(type);
    } else if (type === 'user') {
      return getUserCreatedQuestions();
    } else if (type === 'bookmark') {
      return getBookmarkedQuestions();
    } else {
      return [];
    }
  };

  const data = await getData(roleType);

  return (
    <div className={styles.container}>
      <div className={styles.contentsContainer}>
        <Indicator />
        <div className={styles.listHeaderContainer}>
          <SearchInput />
          <div className={styles.optionContainer}>
            <Options roleType={roleType} isLoggedIn={isLoggedIn} />
          </div>
        </div>
        <div className={styles.listContainer}>
          <div className={styles.sideSelectContainer}>
            <Help />
            <SelectQuestionList />
          </div>
          <div className={styles.itemListContainer}>
            <Suspense key={roleType} fallback={<div>로딩중</div>}>
              {isRoleType(roleType) ? (
                <ItemList
                  data={data as QuestionType[]}
                  renderItem={(item) => (
                    <QuestionItem
                      key={item.id}
                      data={item}
                      isBookmarked={
                        bookmarkData.findIndex(
                          (data) => data.question_id === item.id,
                        ) !== -1
                      }
                    />
                  )}
                />
              ) : roleType === 'user' ? (
                <ItemList
                  data={data as QuestionType[]}
                  renderItem={(item) => (
                    <QuestionItem
                      key={item.id}
                      data={item}
                      isBookmarked={
                        bookmarkData.findIndex(
                          (data) => data.question_id === item.id,
                        ) !== -1
                      }
                    />
                  )}
                />
              ) : roleType === 'bookmark' ? (
                <ItemList
                  data={data as BookmarkedQuestionType[]}
                  renderItem={(item) => (
                    <QuestionItem
                      key={item.id}
                      data={item.question}
                      isBookmarked={
                        bookmarkData.findIndex(
                          (data) => data.question_id === item.question_id,
                        ) !== -1
                      }
                    />
                  )}
                />
              ) : null}
            </Suspense>
          </div>
        </div>
      </div>
      <div className={styles.bottomContainer}>
        <BottomController />
      </div>
    </div>
  );
};

export default Page;
