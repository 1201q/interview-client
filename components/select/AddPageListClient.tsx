'use client';

import { useState } from 'react';
import styles from './styles/questionList.module.css';
import Plus from '@/public/plus.svg';
import XMark from '@/public/xmark.svg';

const AddPageListClient = () => {
  const [question, setQuestion] = useState<string[]>(['']);

  const handleAddInput = () => {
    setQuestion((prev) => [...prev, '']);
  };

  const handleRemoveInput = (index: number) => {
    setQuestion((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = e.target;
    setQuestion((prev) => {
      const newQuestions = [...prev];
      newQuestions[index] = value;
      return newQuestions;
    });
  };

  return (
    <>
      {question.map((value, index) => (
        <div className={`${styles.answer} ${styles.addAnswer}`} key={index}>
          <input
            type="text"
            className={styles.input}
            placeholder="추가할 질문을 입력하세요."
            minLength={10}
            maxLength={150}
            value={value}
            onChange={(e) => handleInputChange(e, index)}
            required
          />
          {index > 0 && (
            <div className={styles.buttonContainer}>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemoveInput(index)}
              >
                <XMark /> <span>삭제</span>
              </button>
            </div>
          )}
        </div>
      ))}
      {question.length < 10 && (
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

export default AddPageListClient;
