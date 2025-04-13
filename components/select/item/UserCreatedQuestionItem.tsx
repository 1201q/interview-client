import { UserQuestionType } from '@/utils/types/types';
import styles from './styles/item.module.css';
import { dayjsFn } from '@/utils/libs/dayjs';
import { getTimeAgo } from '@/utils/formatter/time';
import { useSelectQuestion } from './hooks/useSelectQuestion';

const UserCreatedQuestionItem = ({ data }: { data: UserQuestionType }) => {
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
          <p className={styles.timeAgoText}>
            {getTimeAgo(dayjsFn(data.created_at))}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserCreatedQuestionItem;
