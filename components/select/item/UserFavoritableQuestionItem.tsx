'use client';

import { QuestionType } from '@/utils/types/types';
import styles from './styles/item.module.css';
import VoidStar from '@/public/star-void.svg';
import FillStar from '@/public/star-fill.svg';
import { useSelectQuestion } from './hooks/useSelectQuestion';
import { addQuestionBookmark } from '@/utils/actions/addQuestionBookmark';

const UserFavoritableQuestionItem = ({
  data,
  isBookmarked,
}: {
  data: QuestionType;
  isBookmarked: boolean;
}) => {
  const { handleClick, isSelected } = useSelectQuestion();

  return (
    <div
      key={data.id}
      className={`${styles.answer} ${isSelected(data.id) ? styles.selected : ''}`}
    >
      <div
        onClick={() => handleClick(data.id)}
        className={styles.textContainer}
      >
        <p>{data.question_text}</p>
      </div>

      {!isSelected(data.id) && (
        <div className={styles.rightController}>
          <button
            className={styles.bookMarkButton}
            onClick={() => {
              addQuestionBookmark(data.id);
            }}
          >
            {isBookmarked ? (
              <FillStar className={styles.fillStarSvg} />
            ) : (
              <VoidStar className={styles.voidStarSvg} />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserFavoritableQuestionItem;
