'use client';

import { UserQuestionType } from '@/utils/types/types';
import styles from '../questionList.module.css';
import { useAtom } from 'jotai';
import { selectedQuestionUUIDsAtom } from '@/store/select';

interface Props {
  initData: UserQuestionType[];
}

const UserCreatedQuestionListClient = ({ initData }: Props) => {
  const [selectedQuestionUUIDs, setSelectedQuestionUUIDs] = useAtom(
    selectedQuestionUUIDsAtom,
  );

  if (initData.length === 0) {
    return <div>없음.</div>;
  }

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

export default UserCreatedQuestionListClient;
