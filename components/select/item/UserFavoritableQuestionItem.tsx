'use client';

import { QuestionType } from '@/utils/types/types';
import styles from './styles/item.module.css';
import VoidStar from '@/public/star-void.svg';
import FillStar from '@/public/star-fill.svg';
import { useSelectQuestion } from './hooks/useSelectQuestion';
import { addQuestionBookmark } from '@/utils/actions/addQuestionBookmark';
import { useState } from 'react';
import { deleteQuestionBookmark } from '@/utils/actions/deleteQuestionBookmark';

const UserFavoritableQuestionItem = ({
  data,
  isBookmarked,
}: {
  data: QuestionType;
  isBookmarked: boolean;
}) => {
  const { handleClick, isSelected } = useSelectQuestion();
  const [bookmark, setBookmark] = useState(isBookmarked);

  const handleBookmarkClick = async () => {
    try {
      if (bookmark) {
        await deleteQuestionBookmark(data.id);
      } else {
        await addQuestionBookmark(data.id);
      }

      setBookmark((prev) => !prev);
    } catch (error) {
      console.error('북마크 업데이트 실패', error);
      alert('북마크 업데이트 실패');
    }
  };

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
            onClick={handleBookmarkClick}
          >
            {bookmark ? (
              <FillStar className={styles.fillStarSvg} />
            ) : (
              <FillStar className={styles.voidStarSvg} />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserFavoritableQuestionItem;
