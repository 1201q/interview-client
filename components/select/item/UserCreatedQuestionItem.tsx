import { selectedQuestionUUIDsAtom } from '@/store/select';
import { QuestionType, UserQuestionType } from '@/utils/types/types';
import { useAtom } from 'jotai';
import styles from './item.module.css';

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

  return (
    <div
      onClick={() => handleClick(data.id)}
      key={data.id}
      className={`${styles.answer} ${styles.flex} ${selectedQuestionUUIDs.find((u) => u === data.id) ? styles.selected : ''}`}
    >
      <span>{data.question_text}</span>
      <div className={styles.bottomInfoContainer}>
        <p>{data.created_at}</p>
      </div>
    </div>
  );
};

export default UserCreatedQuestionItem;
