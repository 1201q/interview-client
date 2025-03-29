'use client';

import { QuestionType } from '@/utils/types/types';
import styles from './styles/questionList.module.css';
import { useAtom } from 'jotai';
import { selectedQuestionUUIDsAtom } from '@/store/select';

interface Props {
  initData: QuestionType[];
}

const QuestionListClient = ({ initData }: Props) => {
  if (initData.length === 0) {
    return <div>없음.</div>;
  }

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
    <>
      {initData.map((answer) => (
        <div
          onClick={() => handleClick(answer.id)}
          key={answer.id}
          className={`${styles.answer} ${selectedQuestionUUIDs.find((u) => u === answer.id) ? styles.selected : ''}`}
        >
          {answer.question_text}
        </div>
      ))}
    </>
  );
};

export default QuestionListClient;
