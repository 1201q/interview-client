import { QuestionType } from '@/utils/types/types';
import styles from './styles/item.module.css';
import VoidStar from '@/public/star-void.svg';
import { useSelectQuestion } from './hooks/useSelectQuestion';

const UserFavoritableQuestionItem = ({ data }: { data: QuestionType }) => {
  const { handleClick, isSelected } = useSelectQuestion();

  return (
    <div
      onClick={() => handleClick(data.id)}
      key={data.id}
      className={`${styles.answer} ${isSelected(data.id) ? styles.selected : ''}`}
    >
      <span>{data.question_text}</span>

      {!isSelected(data.id) && (
        <div className={styles.rightController}>
          <button className={styles.bookMarkButton}>
            <VoidStar className={styles.favorite} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserFavoritableQuestionItem;
