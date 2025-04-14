'use client';

import styles from './questionListHeader.module.css';
import Check from '@/public/check.svg';
import React, { FormEvent } from 'react';

import { useRouter } from 'next/navigation';
import { deletedQuestionUUIDsAtom } from '@/store/select';
import { useAtom } from 'jotai';
import { deleteUserQuestions } from '@/utils/actions/deleteUserQuestions';

const DeleteQuestionHeaderClient = () => {
  const router = useRouter();

  const [selectedQuestionUUIDs, setSelectedQuestionUUIDs] = useAtom(
    deletedQuestionUUIDsAtom,
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      deleteUserQuestions(selectedQuestionUUIDs);
      setSelectedQuestionUUIDs([]);

      alert('질문 삭제 성공! 질문 목록에서 확인해보세요.');

      router.refresh();
    } catch (error) {
      alert('질문 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.headerFormContainer}>
        <div className={styles.inputContainer}>
          <p>삭제할 질문들을 선택하세요.</p>
        </div>
        <div className={styles.buttonContainer}>
          <button className={`${styles.deleteButton}`}>
            <Check />
            <p>삭제완료</p>
          </button>
        </div>
      </div>
    </form>
  );
};

export default DeleteQuestionHeaderClient;
