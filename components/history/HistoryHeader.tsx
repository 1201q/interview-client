'use client';

import styles from './styles/h.header.module.css';

interface HeaderProps {
  text: string;
}

const HistoryHeader = ({ text }: HeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.info}>
        <h2>{text}</h2>
      </div>
    </div>
  );
};

export default HistoryHeader;
