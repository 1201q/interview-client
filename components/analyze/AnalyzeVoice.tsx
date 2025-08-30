import styles from './styles/analyze-face-voice.module.css';
import { motion } from 'motion/react';
import { Volume2, Zap, Activity, Heart, Mic } from 'lucide-react';

const AnalyzeVoice = () => {
  return (
    <div className={styles.faceVoiceContainer}>
      <div className={styles.titleContainer}>
        <div className={`${styles.titleIcon} ${styles.red}`}>
          <Mic size={20} color="var(--font-red-color)" />
        </div>
        <p>음성 분석</p>
      </div>
      <div className={styles.itemListContainer}>
        <div className={`${styles.item}  ${styles.blue}`}>
          <div className={`${styles.circle}`}>
            <Volume2 />
          </div>
          <p className={styles.titleText}>명료도</p>
          <p className={styles.scoreText}>85점</p>
          <span>발음과 전달력</span>
          <div className={styles.barContainer}>
            <div className={styles.barColor}></div>
          </div>
        </div>
        <div className={`${styles.item}  ${styles.yellow}`}>
          <div className={`${styles.circle}`}>
            <Zap />
          </div>
          <p className={styles.titleText}>속도</p>
          <p className={styles.scoreText}>85점</p>
          <span>말하기 속도 적절성</span>
          <div className={styles.barContainer}>
            <div className={styles.barColor}></div>
          </div>
        </div>
        <div className={`${styles.item}  ${styles.red}`}>
          <div className={`${styles.circle}`}>
            <Heart />
          </div>
          <p className={styles.titleText}>목소리 톤</p>
          <p className={styles.scoreText}>85점</p>
          <span>목소리 톤의 안정성</span>
          <div className={styles.barContainer}>
            <div className={styles.barColor}></div>
          </div>
        </div>
        <div className={`${styles.item} ${styles.violet}`}>
          <div className={`${styles.circle} `}>
            <Activity />
          </div>
          <p className={styles.titleText}>감정 표현</p>
          <p className={styles.scoreText}>85점</p>
          <span>감정 전달력</span>
          <div className={styles.barContainer}>
            <div className={styles.barColor}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeVoice;
