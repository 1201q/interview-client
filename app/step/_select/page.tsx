import { STEP } from '@/utils/constants/interview.step';
import Link from 'next/link';
import styles from './page.module.css';
import SideOptionSelector from '@/components/select/SideOptionSelector';
import QuestionListServer from '@/components/select/QuestionListServer';

const SelectPage = ({ step }: { step: string }) => {
  const nextStepIndex = STEP.findIndex((s) => s.page === step) + 1;

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <div className={styles.tableOptionsContainer}>
          <SideOptionSelector />
        </div>
        <div className={styles.questionListContainer}>
          <QuestionListServer />
        </div>
      </div>
      {/* <Link href={`/step/${STEP[nextStepIndex].page}`}>다음단계</Link> */}
    </div>
  );
};

export default SelectPage;
