import { motion } from 'motion/react';
import styles from './styles/interview-timebar.module.css';

import { InterviewPhase } from '@/utils/types/interview';

interface TimebarProps {
  phase: InterviewPhase;
  progress: number;
}

const InterviewTimebar = ({ phase, progress }: TimebarProps) => {
  return (
    <div className={styles.fixedContainer}>
      <motion.div
        animate={{
          scale: phase === 'submitting' || phase === 'starting' ? 0.97 : 1,
          opacity: phase === 'submitting' || phase === 'starting' ? 0.6 : 1,
        }}
        className={styles.timebarContainer}
      >
        <motion.div
          className={styles.timerbar}
          animate={{
            translateX: `-${Math.min(100, Math.max(0, progress * 100))}%`,
          }}
          transition={{ duration: 0.1, ease: 'linear' }}
        ></motion.div>
      </motion.div>
    </div>
  );
};

export default InterviewTimebar;
