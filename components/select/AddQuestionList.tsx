'use client';

import styles from './questionList.module.css';
import Plus from '@/public/plus.svg';
import InputItem from './item/InputItem';
import { AnimatePresence, motion } from 'motion/react';

import { v4 as uuidv4 } from 'uuid';
import { addQuestionsAtom } from '@/store/select';
import { useAtom } from 'jotai';

const AddQuestionList = () => {
  const [questions, setQuestions] = useAtom(addQuestionsAtom);
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
      <InputItem
        value={questions[0].question_text}
        index={0}
        handleInputChange={handleInputChange}
        handleRemoveInput={handleRemoveInput}
        isAnimation={false}
      />
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div layout>
          {questions.slice(1).map((q, index) => (
            <InputItem
              key={q.id}
              value={q.question_text}
              index={index + 1}
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

export default AddQuestionList;
