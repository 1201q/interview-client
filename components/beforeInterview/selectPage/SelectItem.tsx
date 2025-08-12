import { QuestionSection } from '@/utils/types/types';
import styles from './styles/select-item.module.css';
import { CheckIcon } from 'lucide-react';

interface SelectItemProps {
  index: number;
  questionText: string;
  basedOnText: string;
  questionSection: QuestionSection;
  id: string;
  onClick: () => void;
  selected: boolean;
}

const SelectItem = (props: SelectItemProps) => {
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
    <div
      onClick={props.onClick}
      className={`${styles.questionLoadingContainer} ${styles.selectable} ${props.selected ? styles.selected : ''}`}
    >
      <div className={styles.topContainer}>
        <div className={styles.leftItem}>
          <div
            className={`${styles.circleContainer} ${props.selected ? styles.selectedCircle : getBadgeStyle(props.questionSection)}`}
          >
            {props.selected ? (
              <CheckIcon width={15} height={15} color="white" strokeWidth={3} />
            ) : (
              props.index + 1
            )}
          </div>
          <p className={styles.titleText}>{props.questionText}</p>
        </div>
      </div>
      <div
        className={`${styles.bottomContainer} ${props.selected ? styles.bottomSelected : ''}`}
      >
        <p>{props.basedOnText}</p>
      </div>
    </div>
  );
};

export default SelectItem;
