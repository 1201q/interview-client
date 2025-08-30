import styles from './styles/analyze-face-voice.module.css';
import { motion } from 'motion/react';
import {
  Smile,
  Heart,
  Target,
  Eye,
  CheckCircle2,
  CircleAlertIcon,
} from 'lucide-react';

const AnalyzeFace = () => {
  return (
    <div className={styles.faceVoiceContainer}>
      <div className={styles.titleContainer}>
        <div className={`${styles.titleIcon} ${styles.blue}`}>
          <Smile size={20} color="var(--font-blue-color)" />
        </div>
        <p>표정 분석</p>
      </div>
      <div className={styles.itemListContainer}>
        <div className={`${styles.item}  ${styles.skyblue}`}>
          <div className={`${styles.circle}`}>
            <Smile />
          </div>
          <p className={styles.titleText}>미소 빈도</p>
          <p className={styles.scoreText}>85점</p>
          <span>자연스럽고 적절한 미소</span>
          <div className={styles.barContainer}>
            <div className={styles.barColor}></div>
          </div>
        </div>
        <div className={`${styles.item}  ${styles.green}`}>
          <div className={`${styles.circle}`}>
            <Eye />
          </div>
          <p className={styles.titleText}>눈맞춤</p>
          <p className={styles.scoreText}>85점</p>
          <span>카메라와의 시선 접촉</span>
          <div className={styles.barContainer}>
            <div className={styles.barColor}></div>
          </div>
        </div>
        <div className={`${styles.item}  ${styles.yellow}`}>
          <div className={`${styles.circle}`}>
            <Heart />
          </div>
          <p className={styles.titleText}>자신감</p>
          <p className={styles.scoreText}>85점</p>
          <span>표정을 통한 자신감 표현</span>
          <div className={styles.barContainer}>
            <div className={styles.barColor}></div>
          </div>
        </div>
        <div className={`${styles.item} ${styles.orange}`}>
          <div className={`${styles.circle} `}>
            <Target />
          </div>
          <p className={styles.titleText}>집중도</p>
          <p className={styles.scoreText}>85점</p>
          <span>질문에 대한 집중도</span>
          <div className={styles.barContainer}>
            <div className={styles.barColor}></div>
          </div>
        </div>
      </div>
      <div className={styles.feedbackItemListContainer}>
        <div className={styles.feedbackItem}>
          <CheckCircle2 size={18} color="var(--main-green-color)" />
          <p>면접 중반부터 자연스러운 미소가 증가하여 좋은 인상을 주었습니다</p>
        </div>
        <div className={styles.feedbackItem}>
          <CheckCircle2 size={18} color="var(--main-green-color)" />
          <p>질문에 대한 집중도가 높아 진지한 태도가 잘 드러났습니다</p>
        </div>
        <div className={styles.feedbackItem}>
          <CheckCircle2 size={18} color="var(--main-green-color)" />
          <p>초반 긴장감이 있었지만 점차 자신감 있는 표정으로 변화했습니다.</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeFace;
