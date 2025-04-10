import styles from './input.module.css';
import XMark from '@/public/xmark.svg';
import React from 'react';
import { ChangeEvent } from 'react';
import { motion } from 'motion/react';

interface Props {
  value: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>, index: number) => void;
  handleRemoveInput: (index: number) => void;
  index: number;
  isAnimation?: boolean;
}

const animation = (isAnimation: boolean) => {
  const animationProps = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: 0.19,
    },
  };

  const noAnimationProps = {
    initial: false,
    animate: {},
    transition: { duration: 0 },
  };

  return isAnimation ? animationProps : noAnimationProps;
};

const InputItem = ({
  value,
  handleInputChange,
  handleRemoveInput,
  index,
  isAnimation = true,
}: Props) => {
  return (
    <motion.div
      layout
      {...animation(isAnimation)}
      className={`${styles.answer} ${styles.addAnswer}`}
    >
      <input
        type="text"
        className={styles.input}
        placeholder="추가할 질문을 입력하세요."
        minLength={10}
        maxLength={150}
        value={value}
        onChange={(e) => handleInputChange(e, index)}
        required
      />
      {index > 0 && (
        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={styles.removeButton}
            onClick={() => handleRemoveInput(index)}
          >
            <XMark /> <span>삭제</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default InputItem;
