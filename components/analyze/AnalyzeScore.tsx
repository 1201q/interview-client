import styles from './styles/analyze-score.module.css';
import { Trophy } from 'lucide-react';
import { motion } from 'motion/react';

const AnalyzeScore = () => {
  const score = 75;
  return (
    <div className={styles.scoreContainer}>
      <Trophy size={50} color="var(--main-darkyellow-color)" />
      <p>면접 완료!</p>
      <span className={styles.darkgray}>
        수고하셨습니다. 결과를 확인해보세요.
      </span>
      <div className={styles.circleContainer}>
        {/* circle */}
        <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={50}
            cy={50}
            r={40}
            stroke="var(--border-main2-color)"
            strokeWidth={9}
            fill="transparent"
          />
          <motion.circle
            cx={50}
            cy={50}
            r={40}
            stroke="url(#gradient)"
            strokeWidth={9}
            fill="transparent"
            strokeLinecap="round"
            initial={{ strokeDasharray: '0 251.2' }}
            animate={{ strokeDasharray: `${(score / 100) * 251.2} 251.2` }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="0%">
              <stop offset={'0%'} stopColor="rgb(37 99 235 / 0.4)" />
              <stop offset={'100%'} stopColor="rgb(37 99 235 / 1)" />
            </linearGradient>
          </defs>
        </svg>
        <div className={styles.circleText}>
          <p>{score}</p>
          <span>점</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeScore;
