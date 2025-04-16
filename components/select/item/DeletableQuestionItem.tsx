'use client';

import { deletedQuestionUUIDsAtom } from '@/store/select';
import { UserQuestionType } from '@/utils/types/types';
import styles from './styles/item.module.css';
import { dayjsFn } from '@/utils/libs/dayjs';
import { getTimeAgo } from '@/utils/formatter/time';
import { useSelectQuestion } from './hooks/useSelectQuestion';
import Status from './Status';

const DeletableQuestionItem = ({ data }: { data: UserQuestionType }) => {
  const { handleClick, isSelected } = useSelectQuestion(
    deletedQuestionUUIDsAtom,
  );

  const selected = isSelected(data.id);

  return (
    <div
      onClick={() => handleClick(data.id)}
      key={data.id}
      className={`${styles.container} ${selected ? styles.selected : ''} ${styles.red}`}
    >
      <div className={styles.deleteTextContainer}>
        <p>{data.question_text}</p>
      </div>
      {!selected && (
        <div className={styles.rightContainer}>
          <Status text={getTimeAgo(dayjsFn(data.created_at))} />
        </div>
      )}
    </div>
  );
};

export default DeletableQuestionItem;
