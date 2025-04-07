import Indicator from '@/components/indicator/Indicator';
import styles from './page.module.css';
import { Suspense } from 'react';

interface Props {
  children: React.ReactNode;
}

const InterviewLayout = ({ children }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.indicatorContainer}>
        <Suspense>
          <Indicator />
        </Suspense>
      </div>
      <div className={styles.contentsContainer}>{children}</div>
    </div>
  );
};

export default InterviewLayout;
