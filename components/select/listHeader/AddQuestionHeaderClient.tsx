'use client';

import styles from './questionListHeader.module.css';
import Check from '@/public/check.svg';
import React, { FormEvent, useState } from 'react';
import AddQuestionClient from '../container/addQuestion/AddQuestionClient';

import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { AddQuestionType } from '@/utils/types/types';
import { createUserQuestions } from '@/utils/actions/createUserQuestions';

interface SubmitQuestions {
  question_text: string;
  role: 'user';
}

const AddQuestionHeaderClient = () => {
  const [questions, setQuestions] = useState<AddQuestionType[]>([
    { question_text: '', id: uuidv4() },
  ]);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const submitQuestions: SubmitQuestions[] = questions.map((q) => {
      return { question_text: q.question_text, role: 'user' };
    });

    try {
      createUserQuestions(submitQuestions);
      setQuestions([{ question_text: '', id: uuidv4() }]);

      alert('질문 추가 성공! 질문 목록에서 확인해보세요.');

      router.refresh();
    } catch (error) {
      alert('질문 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.headerFormContainer}>
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
      <AddQuestionClient questions={questions} setQuestions={setQuestions} />
    </form>
  );
};

export default AddQuestionHeaderClient;
