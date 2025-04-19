import styles from './styles/question.item.module.css';
import FillStar from '@/public/star-fill.svg';

interface Props {
  selected: boolean;
  text: string;
  tags: string[];
}

const QuestionItem = () => {
  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <p>주로 어떤 소셜 미디어 플랫폼을 사용하시나요?</p>
        <button className={styles.bookmarkButton}>
          <FillStar />
        </button>
      </div>

      <div className={styles.bottomContainer}>
        <div className={styles.tag}>프론트엔드</div>
      </div>
    </div>
  );
};

export default QuestionItem;
