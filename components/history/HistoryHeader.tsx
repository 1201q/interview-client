'use client';

import styles from './styles/h.header.module.css';

interface HeaderProps {
  text: string;
}

const HistoryHeader = ({ text }: HeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.info}>
        <h2>진행한 면접</h2>
        <span>{text}</span>
      </div>
    </div>
  );
};

export default HistoryHeader;
