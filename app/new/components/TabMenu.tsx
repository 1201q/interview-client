'use client';

import { useState } from 'react';
import styles from './styles/tab.menu.module.css';
import { motion } from 'motion/react';

interface Props {
  selected: 'file' | 'user';
  handleClick: (menu: 'file' | 'user') => void;
}

const Tabmenu = ({ selected, handleClick }: Props) => {
  return (
    <div className={styles.container}>
      <motion.div
        onClick={() => {
          handleClick('file');
        }}
        className={`${styles.menu}  ${selected === 'file' ? styles.selected : ''}`}
      >
        파일 업로드
      </motion.div>
      <motion.div
        onClick={() => {
          handleClick('user');
        }}
        className={`${styles.menu} ${selected === 'user' ? styles.selected : ''}`}
      >
        직접 입력
      </motion.div>
    </div>
  );
};

export default Tabmenu;
