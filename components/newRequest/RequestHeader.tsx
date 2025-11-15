'use client';

import styles from './styles/r.header.module.css';

interface HeaderProps {
  text: string;
}

const RequestHeader = ({ text }: HeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.info}>
        <h2>새로운 면접 시작</h2>
        <span>{text}</span>
      </div>
    </div>
  );
};

export default RequestHeader;
