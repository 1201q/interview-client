'use client';

import styles from './questionListHeader.module.css';
import Pen from '@/public/pen.svg';
import React, { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import Check from '@/public/check.svg';

import Link from 'next/link';
import Plus from '@/public/plus.svg';
import { AnimatePresence, motion } from 'motion/react';

const ModifyButton = ({ set }: { set: Dispatch<SetStateAction<boolean>> }) => {
  return (
    <motion.button
      onClick={() => {
        set((prev) => !prev);
      }}
      type="button"
      className={`${styles.button} `}
      layoutId="modifyButton"
    >
      <div className={styles.penIcon}>
        <Pen />
      </div>
      <p>편집</p>
    </motion.button>
  );
};

const SelectedModifyButton = ({
  set,
}: {
  set: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <motion.button
      onClick={() => {
        set((prev) => !prev);
      }}
      type="button"
      className={`${styles.submitButton} `}
      layoutId="modifyButton"
    >
      <Check />
      <p>편집완료</p>
    </motion.button>
  );
};

const UserCreatedQuestionListHeaderClient = () => {
  const [modifyMode, setModifyMode] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.container}>
        <div className={styles.inputContainer}>
          <p>내가 추가한 질문</p>
        </div>
        <div className={styles.buttonContainer}>
          {modifyMode ? (
            <SelectedModifyButton set={setModifyMode} />
          ) : (
            <ModifyButton set={setModifyMode} />
          )}
          <AnimatePresence initial={false} mode="popLayout">
            {!modifyMode && (
              <Link href={'/step/select/add'}>
                <motion.button
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  type="button"
                  className={`${styles.button}`}
                >
                  <Plus />
                  <p>직접추가</p>
                </motion.button>
              </Link>
            )}
          </AnimatePresence>
        </div>
      </div>
    </form>
  );
};

export default UserCreatedQuestionListHeaderClient;
