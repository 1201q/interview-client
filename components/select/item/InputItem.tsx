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
}

const InputItem = (props: Props) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.19,
      }}
      className={`${styles.answer} ${styles.addAnswer}`}
    >
      <input
        type="text"
        className={styles.input}
        placeholder="추가할 질문을 입력하세요."
        minLength={10}
        maxLength={150}
        value={props.value}
        onChange={(e) => props.handleInputChange(e, props.index)}
        required
      />
      {props.index > 0 && (
        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={styles.removeButton}
            onClick={() => props.handleRemoveInput(props.index)}
          >
            <XMark /> <span>삭제</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default InputItem;
