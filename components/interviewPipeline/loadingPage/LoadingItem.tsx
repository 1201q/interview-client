import { QuestionSection } from '@/utils/types/types';
import styles from './styles/loading-item.module.css';

interface QuestionLoadingItemProps {
  index: number;
  questionText: string;
  basedOnText: string;
  questionSection: QuestionSection;
}

const LoadingItem = (props: QuestionLoadingItemProps) => {
  return (
    <div className={styles.loadingItemContainer}>
      <div className={styles.topContainer}>
        <div className={styles.leftItem}>
          <div className={styles.circleContainer}>{props.index + 1}</div>
          <p className={styles.titleText}>{props.questionText}</p>
        </div>
      </div>
      <div className={styles.bottomContainer}>
        <p>{props.basedOnText}</p>
      </div>
    </div>
  );
};

export default LoadingItem;
