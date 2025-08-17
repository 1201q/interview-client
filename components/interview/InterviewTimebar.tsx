import { motion, useAnimationControls } from 'motion/react';
import styles from './styles/interview-timebar.module.css';
import { useCallback, useEffect } from 'react';
import { InterviewPhase } from '@/utils/types/interview';

interface TimebarProps {
  phase: InterviewPhase;
}

const InterviewTimebar = ({ phase }: TimebarProps) => {
  const controls = useAnimationControls();

  const start = useCallback(
    (time: number) => {
      controls.start({
        translateX: '-100%',
        transition: { duration: time, ease: 'linear' },
      });
    },
    [controls],
  );

  const stop = useCallback(() => {
    controls.stop();
  }, [controls]);

  const reset = useCallback(() => {
    controls
      .start({
        translateX: '0%',
        transition: { duration: 1.2 },
      })
      .then(() => {
        controls.set({ translateX: '0%' });
      });
  }, [controls]);

  return (
    <motion.div className={styles.timebarContainer}>
      <motion.div
        animate={controls}
        onAnimationComplete={() => {}}
        className={styles.timerbar}
      ></motion.div>
    </motion.div>
  );
};

export default InterviewTimebar;
