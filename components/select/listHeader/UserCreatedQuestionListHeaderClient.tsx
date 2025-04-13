'use client';

import styles from './questionListHeader.module.css';
import Pen from '@/public/pen.svg';
import React, { Dispatch, FormEvent, useState } from 'react';
import Check from '@/public/check.svg';

import { SetStateAction } from 'jotai';

import { motion } from 'motion/react';
import UserCreatedQuestionOptionModal from './UserCreatedQuestionOptionModal';
import { useAtom } from 'jotai';
import {
  isUserPageOptionModalOpenAtom,
  userPageOptionModeAtom,
} from '@/store/select';

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

const DeleteCompleteButton = ({ set }: { set: any }) => {
  return (
    <motion.button
      onClick={() => {
        set(null);
      }}
      type="button"
      className={styles.deleteButton}
      layoutId="userAddPageControllerButton"
      transition={{ duration: 0.1 }}
    >
      <Check />
      <p>삭제완료</p>
    </motion.button>
  );
};

const ModifyCompleteButton = ({ set }: { set: any }) => {
  return (
    <motion.button
      onClick={() => {
        set(null);
      }}
      type="button"
      className={styles.submitButton}
      layoutId="userAddPageControllerButton"
      transition={{ duration: 0.1 }}
    >
      <Check />
      <p>수정완료</p>
    </motion.button>
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

const UserCreatedQuestionListHeaderClient = () => {
  const [isOptionModalOpen, setIsOptionModalOpen] = useAtom(
    isUserPageOptionModalOpenAtom,
  );
  const [optionMode, setOptionMode] = useAtom(userPageOptionModeAtom);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
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
            <DeleteCompleteButton set={setOptionMode} />
          )}

          {isOptionModalOpen && <UserCreatedQuestionOptionModal />}
        </div>
      </div>
    </form>
  );
};

export default UserCreatedQuestionListHeaderClient;
