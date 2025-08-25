import { motion, useAnimationControls } from 'motion/react';
import styles from './styles/interview-timebar.module.css';
import { useCallback, useEffect, useRef } from 'react';
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

  const runIdRef = useRef(0);

  const start = useCallback(
    (time: number, onAnimationComplete: () => Promise<void>) => {
      // 새로운 애니메이션 시 고유 id를 발급함.
      const animationId = ++runIdRef.current;

      controls
        .start({
          translateX: '-100%',
          transition: { duration: time, ease: 'linear' },
        })
        .then(() => {
          if (runIdRef.current === animationId) {
            onAnimationComplete();
          }
        });
    },
    [controls],
  );

  const stop = useCallback(() => {
    runIdRef.current++;
    controls.stop();
  }, [controls]);

  const reset = useCallback(() => {
    runIdRef.current++;

    controls.set({ translateX: '0%' });
    controls.start({
      translateX: '0%',
      transition: { duration: 1.2 },
    });
  }, [controls]);

  useEffect(() => {
    if (phase === 'start') {
      start(10, handleStartCountdown);
    } else if (phase === 'answering') {
      start(10, handleSubmitAnswer);
    } else if (phase === 'submitting' || phase === 'starting') {
      stop();
    } else if (phase === 'submitSuccess' || phase === 'startCountdown3') {
      reset();
    }
  }, [phase, start, stop, reset, handleStartCountdown, handleSubmitAnswer]);

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
