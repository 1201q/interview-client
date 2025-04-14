'use client';

import styles from './styles/questionListHeader.module.css';
import Pen from '@/public/pen.svg';
import React from 'react';
import { motion } from 'motion/react';
import UserCreatedQuestionOptionModal from './UserQuestionOptionModal';
import { useAtom } from 'jotai';
import { isUserPageOptionModalOpenAtom } from '@/store/select';

const UserQuestionListHeader = () => {
  const [isOptionModalOpen, setIsOptionModalOpen] = useAtom(
    isUserPageOptionModalOpenAtom,
  );

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <p>내가 추가한 질문</p>
      </div>
      <div className={styles.buttonContainer}>
        <motion.button
          onClick={() => {
            setIsOptionModalOpen((prev) => !prev);
          }}
          type="button"
          className={`${isOptionModalOpen ? styles.submitButton : styles.button}`}
          layoutId="userAddPageControllerButton"
          transition={{ duration: 0.1 }}
        >
          <div
            className={`${styles.penIcon} ${isOptionModalOpen ? styles.selectedPenIcon : ''}`}
          >
            <Pen />
          </div>
          {isOptionModalOpen ? <p>편집모드</p> : <p>편집</p>}
        </motion.button>
        {isOptionModalOpen && <UserCreatedQuestionOptionModal />}
      </div>
    </div>
  );
};

export default UserQuestionListHeader;
