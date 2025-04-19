import styles from './styles/questionListHeader.module.css';
import Check from '@/public/check.svg';
import React from 'react';

const AiQuestionHeader = () => {
  return (
    <div className={styles.headerFormContainer}>
      <div className={styles.inputContainer}>
        <p>AI로 질문 생성</p>
      </div>
      <div className={styles.buttonContainer}>
        <button type="submit" className={`${styles.submitButton}`}>
          <Check />
          <p>생성하기</p>
        </button>
      </div>
    </div>
  );
};

export default AiQuestionHeader;
