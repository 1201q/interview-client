'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import AngleLeft from '@/public/angle-left.svg';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <div className={styles.tableOptionsContainer}>
          <button className={styles.backButton} onClick={() => router.back()}>
            <AngleLeft />
            <span>뒤로</span>
          </button>
        </div>
        <div className={styles.questionListContainer}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
