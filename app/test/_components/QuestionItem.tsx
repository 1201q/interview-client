'use client';

import { QuestionType } from '@/utils/types/types';
import styles from './styles/question.item.module.css';
import FillStar from '@/public/star-fill.svg';
import { getRoleName } from '@/utils/formatter/question';

import { useSelectQuestion } from './hooks/useSelectQuestion';

interface Props {
  data: QuestionType;
}

const QuestionItem = ({ data }: Props) => {
  const { handleClick, isSelected, selectedIndex } = useSelectQuestion();

  const selected = isSelected(data.id);

  return (
    <div
      className={`${styles.container} ${selected ? styles.selected : ''}`}
      onClick={() => handleClick(data)}
    >
      <div className={styles.topContainer}>
        <p>
          {selected && `${selectedIndex(data.id) + 1}. `}
          {data.question_text}
        </p>
        {!selected && (
          <button className={styles.bookmarkButton}>
            <FillStar />
          </button>
        )}
      </div>
      {!selected && (
        <div className={styles.bottomContainer}>
          <div className={styles.tag}>{getRoleName(data.role)}</div>
        </div>
      )}
    </div>
  );
};

export default QuestionItem;
