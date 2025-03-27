import styles from './styles/check.info.module.css';
import Video from '@/public/video-white.svg';
import Microphone from '@/public/microphone-white.svg';
import Check from '@/public/check.svg';
import Xmark from '@/public/xmark.svg';

// 242424
const CheckInfo = () => {
  return (
    <div className={`${styles.container}`}>
      <div className={styles.infoContainer}>
        <Video className={styles.videoMark} />
        <Check className={styles.checkMark} />
      </div>
      <div className={styles.infoContainer}>
        <Microphone className={styles.microphoneMark} />
        <Xmark className={styles.xMark} />
      </div>
    </div>
  );
};

export default CheckInfo;
