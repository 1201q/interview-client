import {
  getBookmarkedQuestions,
  getQuestionListByRole,
  getUserCreatedQuestions,
} from '@/utils/services/question';
import BottomController from './_components/BottomController';
import Indicator from './_components/Indicator';

import SearchInput from './_components/SearchInput';
import styles from './page.module.css';

import { ExtendedRoleType, QuestionType } from '@/utils/types/types';
import { Suspense } from 'react';

import FilterButton from './_components/FilterButton';
import { isRoleType } from '@/utils/types/guard';
import { cookies } from 'next/headers';
import Help from './_components/Help';
import SelectQuestionList from './_components/SelectQuestionList';
import EditButton from './_components/EditButton';
import ItemList from './_components/ItemList';
import AiBanner from './_components/AiBanner';

type Props = {
  searchParams: Promise<{ [key: string]: ExtendedRoleType }>;
};

const Page = async ({ searchParams }: Props) => {
  const { role } = await searchParams;
  const roleType = role || 'fe';

  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('accessToken');

  const bookmarkData = isLoggedIn ? await getBookmarkedQuestions() : [];

  const getData = async (type: ExtendedRoleType): Promise<QuestionType[]> => {
    if (isRoleType(type)) {
      return getQuestionListByRole(type);
    } else if (type === 'user') {
      return getUserCreatedQuestions();
    } else if (type === 'bookmark') {
      const data = await getBookmarkedQuestions();
      const questions = data.map((item) => item.question);

      return questions;
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
            {isLoggedIn && <EditButton roleType={roleType} />}
            <FilterButton roleType={roleType} isLoggedIn={isLoggedIn} />
          </div>
        </div>
        <div className={styles.listContainer}>
          <div className={styles.sideSelectContainer}>
            <AiBanner />
            <Help />
            <SelectQuestionList />
          </div>
          <div className={styles.itemListContainer}>
            <Suspense key={roleType} fallback={<div>로딩중</div>}>
              <ItemList data={data} bookmarkData={bookmarkData} />
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
