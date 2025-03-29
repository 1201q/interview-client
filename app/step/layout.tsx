import Indicator from '@/components/indicator/Indicator';
import styles from './page.module.css';

interface Props {
  children: React.ReactNode;
}

const InterviewLayout = ({ children }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.indicatorContainer}>
        <Indicator />
      </div>
      <div className={styles.contentsContainer}>{children}</div>
    </div>
  );
};

export default InterviewLayout;
