'use client';

import { useAtomValue } from 'jotai';
import styles from './styles/side.info.module.css';
import Xmark from '@/public/xmark.svg';
import { selectedQuestionsAtom } from '@/store/select';
import { QuestionType } from '@/utils/types/types';
import { useSelectQuestion } from './hooks/useSelectQuestion';
import { AnimatePresence, motion } from 'motion/react';

interface ItemProps {
  data: QuestionType;
  index: number;
}

const SelectQuestionList = () => {
  const selectedQuestions = useAtomValue(selectedQuestionsAtom);

  return (
    <>
      {selectedQuestions.length !== 0 && (
        <div className={styles.container}>
          <div className={styles.topContainer}>
            <p className={styles.titleText}>선택한 질문</p>
          </div>
          <div className={styles.list}>
            <AnimatePresence initial={false} mode="popLayout">
              {selectedQuestions.map((q, index) => (
                <Item data={q} key={q.id} index={index} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  );
};

const Item = ({ data, index }: ItemProps) => {
  const { handleClick } = useSelectQuestion();

  return (
    <motion.div
      layout
      key={data.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15 }}
      className={styles.item}
    >
      <p>
        {`${index + 1}. `}
        {data.question_text}
      </p>
      <button onClick={() => handleClick(data)}>
        <Xmark />
      </button>
    </motion.div>
  );
};

export default SelectQuestionList;
