import { QuestionSection } from '@/utils/types/types';
import styles from './styles/question-item.module.css';

interface QuestionLoadingItemProps {
  index: number;
  questionText: string;
  basedOnText: string;
  questionSection: QuestionSection;
}

const LoadingQuestionItem = (props: QuestionLoadingItemProps) => {
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

  const getBadgeText = (section: QuestionSection) => {
    switch (section) {
      case 'basic':
        return '기본';
      case 'experience':
        return '이력/경험';
      case 'expertise':
        return '전문기술';
      case 'job_related':
        return '직무';
      default:
        return '그외';
    }
  };

  return (
    <div className={styles.questionLoadingContainer}>
      <div className={styles.topContainer}>
        <div className={styles.leftItem}>
          <div className={styles.circleContainer}>{props.index + 1}</div>
          <p className={styles.titleText}>{props.questionText}</p>
        </div>
        {/* <div className={styles.rightItem}>
          <div
            className={`${styles.badgeContainer} ${getBadgeStyle(props.questionSection)}`}
          >
            {getBadgeText(props.questionSection)}
          </div>
        </div> */}
      </div>
      <div className={styles.bottomContainer}>
        <p>{props.basedOnText}</p>
      </div>
    </div>
  );
};

export default LoadingQuestionItem;
