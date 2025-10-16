'use client';

import styles from './styles/r.header.module.css';

interface SidebarProps {
  jobRole: string | null;
  order: number;
}

const ResultHeader = ({ jobRole, order }: SidebarProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.info}>
        <h2>{jobRole} 면접</h2>
        <span>질문 {order + 1}</span>
      </div>
    </div>
  );
};

export default ResultHeader;
