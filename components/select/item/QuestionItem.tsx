import { QuestionType } from '@/utils/types/types';

import styles from './styles/item.module.css';
import { useSelectQuestion } from './hooks/useSelectQuestion';

const QuestionItem = ({ data }: { data: QuestionType }) => {
  const { handleClick, isSelected } = useSelectQuestion();

  return (
    <div
      onClick={() => handleClick(data.id)}
      key={data.id}
      className={`${styles.answer} ${isSelected(data.id) ? styles.selected : ''}`}
    >
      <span>{data.question_text}</span>
    </div>
  );
};

export default QuestionItem;
