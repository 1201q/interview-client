'use client';

import { Dispatch, SetStateAction } from 'react';
import styles from '../questionList.module.css';
import Plus from '@/public/plus.svg';
import InputItem from '../../item/InputItem';

interface Props {
  questions: string[];
  setQuestions: Dispatch<SetStateAction<string[]>>;
}

const AddQuestionClient = ({ questions, setQuestions }: Props) => {
  const handleAddInput = () => {
    setQuestions((prev) => [...prev, '']);
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
      newQuestions[index] = value;
      return newQuestions;
    });
  };

  return (
    <>
      {questions.map((value, index) => (
        <InputItem
          value={value}
          index={index}
          handleInputChange={handleInputChange}
          handleRemoveInput={handleRemoveInput}
          key={index}
        />
      ))}
      {questions.length < 10 && (
        <button
          type="button"
          className={styles.addInputContainer}
          onClick={handleAddInput}
        >
          <span>
            <Plus />
          </span>
        </button>
      )}
    </>
  );
};

export default AddQuestionClient;
