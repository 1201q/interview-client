import styles from './styles/resume.loading.module.css';
import Lottie from 'react-lottie-player';
import loadingJson from '@/public/loading.json';
import Clock from '@/public/clock-regular.svg';

const ResumeLoading = () => {
  return (
    <div className={styles.container}>
      <Lottie
        animationData={loadingJson}
        play
        style={{ width: 400, height: 400 }}
      />
      <div className={styles.textContainer}>
        <p>이력서를 체크하는 중이에요</p>
        <div className={styles.remainingTime}>
          <Clock /> <span>예상 30초</span>
        </div>
      </div>
    </div>
  );
};

export default ResumeLoading;
