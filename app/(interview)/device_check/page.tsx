import styles from './page.module.css';
import Link from 'next/link';

const DeviceCheckPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.headerContainer}>
          <div className={styles.titleContainer}>
            <p>안내사항</p>
          </div>
        </div>
        <div className={styles.contentsContainer}>
          <Link href={'/device_check/camera'}>
            <button>다음단계</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeviceCheckPage;
