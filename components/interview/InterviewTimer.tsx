import { InterviewPhase } from '@/utils/types/interview';
import styles from './styles/interview-timer.module.css';
import { Clock } from 'lucide-react';

import { motion, Variants } from 'motion/react';

interface TimerProps {
  phase: InterviewPhase;
  remainingSec: number;
}

const pad = (n: number) => {
  return n < 10 ? `0${n}` : `${n}`;
};

const variants: Variants = {
  submitting: { opacity: 0.6, scale: 0.9, y: -5 },
  submitSuccess: { opacity: 1 },
  starting: { opacity: 0.6, scale: 0.9, y: -5 },
  startCountdown3: { opacity: 1 },
};

const formatting = (sec: number) => {
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;

  return `${minutes}:${pad(seconds)}`;
};

const InterviewTimer = ({ phase, remainingSec }: TimerProps) => {
  return (
    <motion.div
      className={`${styles.timerContainer} ${phase === 'answering' && remainingSec <= 20 ? styles.redAlram : ''}`}
      variants={variants}
      animate={phase}
    >
      <Clock size={14} color="white" />
      <p>{formatting(remainingSec)}</p>
    </motion.div>
  );
};

export default InterviewTimer;
