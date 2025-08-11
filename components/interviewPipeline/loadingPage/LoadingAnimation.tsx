'use client';

import { FileText, Briefcase, Brain, Sparkles } from 'lucide-react';
import styles from './styles/loading-animation.module.css';
import { Timer, ZapIcon } from 'lucide-react';
import { Variants, motion } from 'motion/react';

// 등장 애니메이션
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 자식간
      delayChildren: 0.1, // 첫 자식 시작까지 딜레이
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { stiffness: 80, type: 'spring' },
  },
};

interface LoadingAnimationProps {
  progress: number;
}

const LoadingAnimation = ({ progress }: LoadingAnimationProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={styles.loadingContainer}
    >
      {/* 상단 로딩 원 */}
      <motion.div
        variants={itemVariants}
        className={styles.loadingCircleContainer}
      >
        <div className={styles.loadingCircle}>
          <motion.div
            className={styles.rotatingCircle}
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          >
            <ZapIcon color="white" />
          </motion.div>
        </div>
        {[FileText, Briefcase, Brain, Sparkles].map((Icon, index) => (
          <motion.div
            key={index}
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: '0 0',
              position: 'absolute',
            }}
            animate={{
              rotate: 360,
              x: Math.cos((index * Math.PI) / 2) * 80,
              y: Math.sin((index * Math.PI) / 2) * 80,
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
              delay: index * 0.5,
            }}
          >
            <div className={styles.circleItem}>
              <Icon />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 그라디언트 텍스트 */}
      <motion.div
        variants={itemVariants}
        className={styles.loadingContentsContainer}
      >
        <h3 className={styles.gradientText}>
          AI가 면접 질문을 생성하고 있어요
        </h3>
      </motion.div>

      {/* 안내 텍스트  */}
      <motion.div
        variants={itemVariants}
        className={styles.loadingContentsContainer}
      >
        <p>
          이력서와 채용공고를 꼼꼼히 분석하여 맞춤형 면접 질문을 만들고 있어요.
          조금만 기다려 주세요.
        </p>
      </motion.div>

      {/* 프로그레스 바 */}
      <motion.div
        variants={itemVariants}
        className={styles.loadingContentsContainer}
      >
        <div className={styles.progressbarContainer}>
          <div className={styles.progressbarHeaderContainer}>
            <span>진행률</span>
            <span>{progress}%</span>
          </div>
          <div className={styles.progressbar}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={styles.bar}
            ></motion.div>
          </div>
        </div>
      </motion.div>

      {/* 남은 시간 */}
      <motion.div
        variants={itemVariants}
        className={styles.loadingContentsContainer}
      >
        <div className={styles.timeLeftContainer}>
          <Timer width={14} height={14} />
          <p>예상 분석시간 : 30초 ~ 1분</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingAnimation;
