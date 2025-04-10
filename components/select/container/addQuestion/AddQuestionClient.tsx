'use client';

import { Dispatch, SetStateAction } from 'react';
import styles from '../questionList.module.css';
import Plus from '@/public/plus.svg';
import InputItem from '../../item/InputItem';
import { AnimatePresence, motion } from 'motion/react';
import { AddQuestionType } from '@/utils/types/types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  questions: AddQuestionType[];
  setQuestions: Dispatch<SetStateAction<AddQuestionType[]>>;
}

const AddQuestionClient = ({ questions, setQuestions }: Props) => {
  const handleAddInput = () => {
    setQuestions((prev) => [...prev, { question_text: '', id: uuidv4() }]);
  };

  const handleRemoveInput = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = e.target;
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[index].question_text = value;
      return newQuestions;
    });
  };

  return (
    <>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div layout>
          {questions.map((q, index) => (
            <InputItem
              key={q.id}
              value={q.question_text}
              index={index}
              handleInputChange={handleInputChange}
              handleRemoveInput={handleRemoveInput}
            />
          ))}
        </motion.div>
      </AnimatePresence>
      {questions.length < 10 && (
        <motion.button
          layout
          type="button"
          className={styles.addInputContainer}
          onClick={handleAddInput}
          transition={{
            duration: 0.19,
          }}
        >
          <span>
            <Plus />
          </span>
        </motion.button>
      )}
    </>
  );
};

export default AddQuestionClient;
