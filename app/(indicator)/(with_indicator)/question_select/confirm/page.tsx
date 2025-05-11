import styles from '../../page.module.css';

import PageHeader from '@/components/common/PageHeader';
import QuestionCheck from '../_components/QuestionCheck';
import QuestionConfirmController from '../_components/QuestionConfirmController';
import { Suspense } from 'react';

const QuestionConfirmPage = () => {
  return (
    <>
      <div className={styles.listContainer}>
        <div className={styles.itemListContainer}>
          <PageHeader
            titleText="질문 순서 확인"
            subtitleText="아이템을 드래그하여 질문 순서를 바꿀 수 있습니다."
          />
          <Suspense>
            <QuestionCheck />
          </Suspense>
        </div>
      </div>

      <QuestionConfirmController />
    </>
  );
};

export default QuestionConfirmPage;
