import { selectedQuestionUUIDsAtom } from '@/store/select';
import { QuestionType } from '@/utils/types/types';
import { useAtom } from 'jotai';
import styles from './item.module.css';
import VoidStar from '@/public/star-void.svg';

const UserFavoritableQuestionItem = ({ data }: { data: QuestionType }) => {
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
          <button className={styles.bookMarkButton}>
            <VoidStar className={styles.favorite} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserFavoritableQuestionItem;
