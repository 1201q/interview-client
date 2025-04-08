'use client';

import styles from './styles/questionListHeader.module.css';
import Check from '@/public/check.svg';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const AddPageHeaderClient = ({ children }: Props) => {
  return (
    <form>
      <div className={styles.headerContainer}>
        <div className={styles.inputContainer}>
          <p>나만의 질문 추가</p>
        </div>
        <div className={styles.buttonContainer}>
          <button className={`${styles.submitButton}`}>
            <Check />
            <p>작성완료</p>
          </button>
        </div>
      </div>
      {children}
    </form>
  );
};

export default AddPageHeaderClient;
