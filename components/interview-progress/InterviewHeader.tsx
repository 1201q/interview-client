'use client';

import styles from './styles/i.header.module.css';

const InterviewHeader = () => {
  return (
    <div className={styles.header}>
      <div className={styles.info}>
        <h2>인터뷰 세션</h2>
        <span>모의 인터뷰</span>
      </div>
    </div>
  );
};

export default InterviewHeader;
