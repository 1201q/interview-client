'use client';

import styles from './styles/questionListHeader.module.css';
import Check from '@/public/check.svg';
import React, { FormEvent, useState } from 'react';
import AddPageListClient from './AddPageListClient';

interface SubmitQuestions {
  question_text: string;
  role: 'user';
}

interface Props {
  createUserQuestions: (data: SubmitQuestions[]) => Promise<void>;
}

const AddPageHeaderClient = ({ createUserQuestions }: Props) => {
  const [questions, setQuestions] = useState<string[]>(['']);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const submitQuestions: SubmitQuestions[] = questions.map((q) => {
      return { question_text: q, role: 'user' };
    });

    try {
      await createUserQuestions(submitQuestions);
      setQuestions(['']);
      alert('질문이 추가되었습니다.');
    } catch (error) {
      alert('질문 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <AddPageListClient questions={questions} setQuestions={setQuestions} />
    </form>
  );
};

export default AddPageHeaderClient;
