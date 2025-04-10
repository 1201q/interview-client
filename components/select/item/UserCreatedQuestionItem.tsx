import { selectedQuestionUUIDsAtom } from '@/store/select';
import { UserQuestionType } from '@/utils/types/types';
import { useAtom } from 'jotai';
import styles from './item.module.css';
import { dayjsFn } from '@/utils/libs/dayjs';
import { getTimeAgo } from '@/utils/formatter/time';

const UserCreatedQuestionItem = ({ data }: { data: UserQuestionType }) => {
  const [selectedQuestionUUIDs, setSelectedQuestionUUIDs] = useAtom(
    selectedQuestionUUIDsAtom,
  );

  const handleClick = (id: string) => {
    setSelectedQuestionUUIDs((prev) => {
      if (prev.includes(id)) {
        return prev.filter((u) => u !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isSelected = (id: string) => {
    return selectedQuestionUUIDs.includes(id);
  };

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
