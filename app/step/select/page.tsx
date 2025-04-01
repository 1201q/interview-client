import styles from './page.module.css';
import QuestionListServer from '@/components/select/QuestionListServer';
import SidebarServer from '@/components/select/SidebarServer';
import QuestionListHeaderServer from '@/components/select/QuestionListHeaderServer';
import { RoleType } from '@/utils/types/types';
import { Suspense } from 'react';

interface Props {
  searchParams: {
    role: RoleType;
  };
}

const SelectPage = async ({ searchParams }: Props) => {
  const { role } = await searchParams;
  const roleType = role || 'fe';

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <div className={styles.tableOptionsContainer}>
          <SidebarServer />
        </div>
        <div className={styles.questionListContainer}>
          <QuestionListHeaderServer />
          <Suspense key={roleType} fallback={<div>loading....</div>}>
            <QuestionListServer role={roleType} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default SelectPage;
