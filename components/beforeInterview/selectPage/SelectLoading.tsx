import { useRouter } from 'next/navigation';
import styles from './styles/select-loading.module.css';

const SelectLoading = () => {
  const router = useRouter();

  return (
    <div className={styles.selectLoadingContainer}>
      <div className={styles.contetnsContainer}>
        <p className={styles.text}>면접 세팅 중입니다</p>
      </div>
    </div>
  );
};

export default SelectLoading;
