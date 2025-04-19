import { QuestionType } from '@/utils/types/types';
import styles from './styles/question.item.module.css';
import FillStar from '@/public/star-fill.svg';
import { getRoleName } from '@/utils/formatter/question';

interface Props {
  data: QuestionType;
}

const QuestionItem = ({ data }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <p>{data.question_text}</p>
        <button className={styles.bookmarkButton}>
          <FillStar />
        </button>
      </div>

      <div className={styles.bottomContainer}>
        <div className={styles.tag}>{getRoleName(data.role)}</div>
      </div>
    </div>
  );
};

export default QuestionItem;
