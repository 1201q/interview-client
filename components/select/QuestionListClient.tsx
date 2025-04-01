'use client';

import { QuestionType } from '@/utils/types/types';
import styles from './styles/questionList.module.css';
import { useAtom } from 'jotai';
import {
  isUserAddButtonSelectedAtom,
  selectedQuestionUUIDsAtom,
} from '@/store/select';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef } from 'react';

interface Props {
  initData: QuestionType[];
}

const QuestionListClient = ({ initData }: Props) => {
  const [selectedQuestionUUIDs, setSelectedQuestionUUIDs] = useAtom(
    selectedQuestionUUIDsAtom,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAddMode, setIsAddMode] = useAtom(isUserAddButtonSelectedAtom);

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

  useEffect(() => {
    return () => {
      setIsAddMode(false);
    };
  }, [initData]);

  useEffect(() => {
    if (isAddMode) {
      inputRef.current?.focus();
    }
  }, [isAddMode]);

  return (
    <>
      <AnimatePresence>
        {isAddMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`${styles.answer} ${styles.input}`}
          >
            <input
              type="text"
              ref={inputRef}
              placeholder="추가하고 싶은 질문을 입력하세요."
            />
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
