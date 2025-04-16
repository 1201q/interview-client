'use client';

import { QuestionType, UserQuestionType } from '@/utils/types/types';

import styles from './styles/item.module.css';
import { useSelectQuestion } from './hooks/useSelectQuestion';
import { useState } from 'react';

import { motion } from 'motion/react';
import Status from './Status';
import { getTimeAgo } from '@/utils/formatter/time';
import { dayjsFn } from '@/utils/libs/dayjs';
import BookmarkButton from './BookmarkButton';

interface Props<T extends QuestionType | UserQuestionType> {
  data: T;
  isBookmarked: boolean;
  displayRightContainer?: boolean;
}

const SelectableQuestionItem = <T extends QuestionType | UserQuestionType>({
  data,
  isBookmarked,
  displayRightContainer = false,
}: Props<T>) => {
  const { handleClick, isSelected, selectedIndex } = useSelectQuestion();
  const [bookmark, setBookmark] = useState(isBookmarked);

  const selected = isSelected(data.id);

  return (
    <div
      key={data.id}
      className={`${styles.container} ${selected ? styles.selected : ''}`}
    >
      {/* 아이템 선택시 선택 index 노출 */}
      {/* 해제시 북마크 버튼 노출 */}
      {!isSelected(data.id) ? (
        <div className={styles.itemHeaderContainer}>
          <BookmarkButton
            bookmark={bookmark}
            setBookmark={setBookmark}
            questionId={data.id}
          />
        </div>
      ) : (
        <p className={styles.selectedIndexText}>{selectedIndex(data.id) + 1}</p>
      )}

      <div
        className={styles.textContainer}
        onClick={() => handleClick(data.id)}
      >
        <motion.p layout transition={{ duration: 0.15 }}>
          {data.question_text}
        </motion.p>
      </div>
      {displayRightContainer && (
        <div className={styles.rightContainer}>
          {!isSelected(data.id) && 'created_at' in data && (
            <Status text={getTimeAgo(dayjsFn(data.created_at))} />
          )}
        </div>
      )}
    </div>
  );
};

export default SelectableQuestionItem;
