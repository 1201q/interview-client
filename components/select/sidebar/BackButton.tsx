'use client';

import { useRouter } from 'next/navigation';
import styles from './sidebar.module.css';
import AngleLeft from '@/public/angle-left.svg';

const BackButton = () => {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className={styles.backButton}>
      <AngleLeft />
      <span>뒤로</span>
    </button>
  );
};

export default BackButton;
