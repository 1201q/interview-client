'use client';

import { useRouter } from 'next/navigation';
import styles from '../_styles/layout.module.css';
import AngleLeft from '@/public/angle-left.svg';

const Page = () => {
  const router = useRouter();
  return (
    <div className={styles.tableOptionsContainer}>
      <button className={styles.backButton} onClick={() => router.back()}>
        <AngleLeft />
        <span>뒤로</span>
      </button>
    </div>
  );
};
export default Page;
