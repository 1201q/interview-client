import { QuestionSection } from '@/utils/types/types';
import styles from './styles/question-item.module.css';

interface QuestionLoadingItemProps {
  index: number;
  questionText: string;
  basedOnText: string;
  questionSection: QuestionSection;
}

const SelectableQuestionItem = (props: QuestionLoadingItemProps) => {
  const getBadgeStyle = (section: QuestionSection) => {
    switch (section) {
      case 'basic':
        return styles.blue;
      case 'experience':
        return styles.red;
      case 'expertise':
        return styles.violet;
      case 'job_related':
        return styles.green;
      default:
        return styles.blue;
    }
  };

  return (
    <div className={styles.questionLoadingContainer}>
      <div className={styles.topContainer}>
        <div className={styles.leftItem}>
          <div
            className={`${styles.circleContainer} ${getBadgeStyle(props.questionSection)}`}
          >
            {props.index + 1}
          </div>
          <p className={styles.titleText}>{props.questionText}</p>
        </div>
      </div>
      <div className={styles.bottomContainer}>
        <p>{props.basedOnText}</p>
      </div>
    </div>
  );
};

export default SelectableQuestionItem;
