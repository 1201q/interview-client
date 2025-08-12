'use client';

import styles from './layout.module.css';

interface Props {
  children: React.ReactNode;
}

export default function InterviewLayout({ children }: Readonly<Props>) {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.main}>{children}</div>
    </div>
  );
}
