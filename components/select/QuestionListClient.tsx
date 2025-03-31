'use client';

import { QuestionType } from '@/utils/types/types';
import styles from './styles/questionList.module.css';
import { useAtom, useAtomValue } from 'jotai';
import {
  isUserAddButtonSelectedAtom,
  selectedQuestionUUIDsAtom,
} from '@/store/select';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  initData: QuestionType[];
}

const QuestionListClient = ({ initData }: Props) => {
  const [selectedQuestionUUIDs, setSelectedQuestionUUIDs] = useAtom(
    selectedQuestionUUIDsAtom,
  );
  const isAddMode = useAtomValue(isUserAddButtonSelectedAtom);

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
      <AnimatePresence>
        {isAddMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={styles.answer}
          >
            추가모드
          </motion.div>
        )}
      </AnimatePresence>
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
