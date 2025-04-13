'use client';

import styles from './questionListHeader.module.css';
import Pen from '@/public/pen.svg';
import React, { Dispatch, FormEvent } from 'react';
import Check from '@/public/check.svg';

import { SetStateAction } from 'jotai';

import { motion } from 'motion/react';
import UserCreatedQuestionOptionModal from './UserCreatedQuestionOptionModal';
import { useAtom } from 'jotai';
import {
  deletedQuestionUUIDsAtom,
  isUserPageOptionModalOpenAtom,
  userPageOptionModeAtom,
} from '@/store/select';
import { useRouter } from 'next/navigation';

interface Props {
  handleDeleteSubmit: (items: string[]) => Promise<void>;
}

interface DeleteButtonProps {
  handleSubmit: (e: FormEvent) => void;
}

const UserCreatedQuestionListHeaderClient = ({ handleDeleteSubmit }: Props) => {
  const [isOptionModalOpen, setIsOptionModalOpen] = useAtom(
    isUserPageOptionModalOpenAtom,
  );
  const [optionMode, setOptionMode] = useAtom(userPageOptionModeAtom);
  const [selectedQuestionUUIDs, setSelectedQuestionUUIDs] = useAtom(
    deletedQuestionUUIDsAtom,
  );

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (selectedQuestionUUIDs.length === 0) {
      setOptionMode(null);
      return;
    }

    try {
      await handleDeleteSubmit(selectedQuestionUUIDs);
      setOptionMode(null);
      setSelectedQuestionUUIDs([]);

      alert('질문 삭제 성공! 질문 목록에서 확인해보세요.');

      router.refresh();
    } catch (error) {
      alert('질문 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <HeaderText optionMode={optionMode} />
      </div>
      <div className={styles.buttonContainer}>
        {optionMode === null && (
          <ModifyButton
            set={setIsOptionModalOpen}
            selected={isOptionModalOpen}
          />
        )}
        {optionMode === 'delete' && (
          <DeleteCompleteButton handleSubmit={handleSubmit} />
        )}

        {isOptionModalOpen && <UserCreatedQuestionOptionModal />}
      </div>
    </div>
  );
};

const ModifyButton = ({
  set,
  selected,
}: {
  set: Dispatch<SetStateAction<boolean>>;
  selected: boolean;
}) => {
  return (
    <motion.button
      onClick={() => {
        set((prev) => !prev);
      }}
      type="button"
      className={`${selected ? styles.submitButton : styles.button}`}
      layoutId="userAddPageControllerButton"
      transition={{ duration: 0.1 }}
    >
      <div
        className={`${styles.penIcon} ${selected ? styles.selectedPenIcon : ''}`}
      >
        <Pen />
      </div>
      {selected ? <p>편집모드</p> : <p>편집</p>}
    </motion.button>
  );
};

const DeleteCompleteButton = ({ handleSubmit }: DeleteButtonProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <motion.button
        type="submit"
        className={styles.deleteButton}
        layoutId="userAddPageControllerButton"
        transition={{ duration: 0.1 }}
      >
        <Check />
        <p>삭제완료</p>
      </motion.button>
    </form>
  );
};

const HeaderText = ({
  optionMode,
}: {
  optionMode: 'delete' | 'modify' | null;
}) => {
  if (optionMode === 'delete') {
    return <p>삭제할 질문들을 선택하세요.</p>;
  }

  if (optionMode === 'modify') {
    return <p>수정할 질문을 선택하세요.</p>;
  }

  return <p>내가 추가한 질문</p>;
};

export default UserCreatedQuestionListHeaderClient;
