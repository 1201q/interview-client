import { motion, useAnimationControls } from 'motion/react';
import styles from './styles/interview-timebar.module.css';
import { useCallback, useEffect } from 'react';
import { InterviewPhase } from '@/utils/types/interview';

interface TimebarProps {
  phase: InterviewPhase;
  handleSubmitAnswer: () => Promise<void>;
  handleStartCountdown: () => Promise<void>;
}

const InterviewTimebar = ({
  phase,
  handleSubmitAnswer,
  handleStartCountdown,
}: TimebarProps) => {
  const controls = useAnimationControls();

  const start = useCallback(
    (time: number, onAnimationComplete: () => Promise<void>) => {
      controls
        .start({
          translateX: '-100%',
          transition: { duration: time, ease: 'linear' },
        })
        .then(() => {
          onAnimationComplete();
        });
    },
    [controls],
  );

  const stop = useCallback(() => {
    controls.stop();
  }, [controls]);

  const reset = useCallback(() => {
    controls.start({
      translateX: '0%',
      transition: { duration: 1.2 },
    });
  }, [controls]);

  useEffect(() => {
    if (phase === 'start') {
      start(60, handleStartCountdown);
    } else if (phase === 'answering') {
      start(180, handleSubmitAnswer);
    } else if (phase === 'submitting' || phase === 'starting') {
      stop();
    } else if (phase === 'submitSuccess' || phase === 'startCountdown3') {
      reset();
    }
  }, [phase]);

  return (
    <div className={styles.fixedContainer}>
      <motion.div
        animate={{
          scale: phase === 'submitting' || phase === 'starting' ? 0.97 : 1,
          opacity: phase === 'submitting' || phase === 'starting' ? 0.6 : 1,
        }}
        className={styles.timebarContainer}
      >
        <motion.div animate={controls} className={styles.timerbar}></motion.div>
      </motion.div>
    </div>
  );
};

export default InterviewTimebar;
