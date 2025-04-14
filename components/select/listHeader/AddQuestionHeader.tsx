import styles from './styles/questionListHeader.module.css';
import Check from '@/public/check.svg';
import React from 'react';

const AddQuestionHeader = () => {
  return (
    <div className={styles.headerFormContainer}>
      <div className={styles.inputContainer}>
        <p>나만의 질문 추가</p>
      </div>
      <div className={styles.buttonContainer}>
        <button type="submit" className={`${styles.submitButton}`}>
          <Check />
          <p>작성완료</p>
        </button>
      </div>
    </div>
  );
};

export default AddQuestionHeader;
