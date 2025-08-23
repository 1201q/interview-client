import { useRouter } from 'next/navigation';
import styles from './styles/select-loading.module.css';
import { motion } from 'motion/react';

const SelectLoading = () => {
  const router = useRouter();

  return (
    <div className={styles.selectLoadingContainer}>
      <div className={styles.contetnsContainer}>
        <p className={styles.text}>면접 세팅 중입니다</p>
      </div>
      <button
        onClick={() => {
          router.push(`/interview/1`);
        }}
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 300 }}
      >
        다음
      </button>
    </div>
  );
};

export default SelectLoading;
