import QuestionSelectController from './_components/QuestionSelectController';

import SearchInput from './_components/SearchInput';
import styles from '../page.module.css';

import { ExtendedRoleType } from '@/utils/types/types';
import { Suspense } from 'react';

import FilterButton from './_components/FilterButton';

import { cookies } from 'next/headers';
import Help from './_components/Help';
import SelectQuestionList from './_components/SelectQuestionList';
import EditButton from './_components/EditButton';

import AiBanner from './_components/AiBanner';
import ItemListServer from './_components/ItemListServer';

type Props = {
  searchParams: Promise<{ [key: string]: ExtendedRoleType }>;
};

const Page = async ({ searchParams }: Props) => {
  const { role } = await searchParams;
  const roleType = role || 'fe';

  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('accessToken');

  return (
    <>
      <div className={styles.listHeaderContainer}>
        <SearchInput />
        <div className={styles.optionContainer}>
          {isLoggedIn && <EditButton />}
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
            <ItemListServer roleType={roleType} />
          </Suspense>
        </div>
      </div>
      <QuestionSelectController />
    </>
  );
};

export default Page;
