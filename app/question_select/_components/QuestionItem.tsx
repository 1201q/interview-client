'use client';

import { QuestionType } from '@/utils/types/types';
import styles from './styles/question.item.module.css';
import FillStar from '@/public/star-fill.svg';
import { getRoleName } from '@/utils/formatter/question';
import { useSelectQuestion } from './hooks/useSelectQuestion';
import { useState } from 'react';
import { hasAccessToken } from '@/utils/actions/hasAccessToken';
import { useRouter } from 'next/navigation';
import { deleteQuestionBookmark } from '@/utils/actions/deleteQuestionBookmark';
import { addQuestionBookmark } from '@/utils/actions/addQuestionBookmark';

import { AnimatePresence, motion } from 'motion/react';

interface Props {
  data: QuestionType;
  isBookmarked: boolean;
}

interface BookmarkButtonProps {
  handleButtonClick: () => Promise<void>;
  bookmarked: boolean;
}

const QuestionItem = ({ data, isBookmarked }: Props) => {
  const router = useRouter();

  const { handleClick, isSelected, selectedIndex } = useSelectQuestion();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const selected = isSelected(data.id);

  const handleBookmarkButtonClick = async () => {
    try {
      const isLoggedIn = await hasAccessToken();

      if (!isLoggedIn) {
        alert('로그인이 필요합니다.');
        router.push(`/login?prevPage=select`);
        return;
      }

      if (bookmarked) {
        await deleteQuestionBookmark(data.id);
      } else {
        await addQuestionBookmark(data.id);
      }

      setBookmarked((prev) => !prev);
    } catch (error) {
      console.error('북마크 업데이트 실패', error);
      alert('북마크 업데이트 실패');
    }
  };

  return (
    <motion.div
      className={`${styles.container} ${selected ? styles.selected : ''}`}
      onClick={() => handleClick(data)}
    >
      <div className={styles.topContainer}>
        <p>
          {selected && `${selectedIndex(data.id) + 1}. `}
          {data.question_text}
        </p>
        {!selected && (
          <BookmarkButton
            bookmarked={bookmarked}
            handleButtonClick={handleBookmarkButtonClick}
          />
        )}
      </div>
      <AnimatePresence initial={false}>
        {!selected && (
          <motion.div
            key="bottom"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={styles.bottomContainer}
          >
            <div className={styles.tag}>{getRoleName(data.role)}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const BookmarkButton = ({
  bookmarked,
  handleButtonClick,
}: BookmarkButtonProps) => {
  return (
    <button
      className={`${styles.bookmarkButton} ${bookmarked ? styles.checked : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        handleButtonClick();
      }}
    >
      <FillStar />
    </button>
  );
};

export default QuestionItem;
