'use client';

import styles from './styles/i.header.module.css';
import { Pause } from 'lucide-react';

const InterviewHeader = () => {
  return (
    <div className={styles.header}>
      <div className={styles.status}>
        <Pause />
      </div>
      <div className={styles.info}>
        <h2>백엔드 개발자</h2>
        <span>모의 인터뷰</span>
      </div>
    </div>
  );
};

export default InterviewHeader;
