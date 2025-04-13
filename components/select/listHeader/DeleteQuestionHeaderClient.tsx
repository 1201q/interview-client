'use client';

import styles from './questionListHeader.module.css';
import Check from '@/public/check.svg';
import React, { FormEvent } from 'react';

import { useRouter } from 'next/navigation';
import { deletedQuestionUUIDsAtom } from '@/store/select';
import { useAtom } from 'jotai';

interface Props {
  children: React.ReactNode;
  submitAction: (questions: string[]) => Promise<{ success: boolean }>;
}

const DeleteQuestionHeaderClient = ({ children, submitAction }: Props) => {
  const router = useRouter();

  const [selectedQuestionUUIDs, setSelectedQuestionUUIDs] = useAtom(
    deletedQuestionUUIDsAtom,
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (selectedQuestionUUIDs.length === 0) {
      alert('삭제할 질문을 선택해주세요.');
      return;
    }

    try {
      const success = await submitAction(selectedQuestionUUIDs);

      if (!success) {
        throw new Error('질문 삭제에 실패했습니다.');
      }

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
      <div className={styles.row}>{children}</div>
    </form>
  );
};

export default DeleteQuestionHeaderClient;
