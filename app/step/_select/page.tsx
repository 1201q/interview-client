import { STEP } from '@/utils/constants/interview.step';
import styles from './page.module.css';
import QuestionListServer from '@/components/select/QuestionListServer';
import { Suspense } from 'react';
import SidebarServer from '@/components/select/SidebarServer';
import QuestionListHeaderServer from '@/components/select/QuestionListHeaderServer';

const SelectPage = ({ step }: { step: string }) => {
  const nextStepIndex = STEP.findIndex((s) => s.page === step) + 1;

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <div className={styles.tableOptionsContainer}>
          <SidebarServer />
        </div>
        <div className={styles.questionListContainer}>
          <QuestionListHeaderServer />
          <Suspense fallback={<div>Loading...</div>}>
            <QuestionListServer />
          </Suspense>
        </div>
      </div>
      {/* <Link href={`/step/${STEP[nextStepIndex].page}`}>다음단계</Link> */}
    </div>
  );
};

export default SelectPage;
