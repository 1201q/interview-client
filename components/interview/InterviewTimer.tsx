import { InterviewPhase } from '@/utils/types/interview';
import styles from './styles/interview-timer.module.css';
import { Clock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion, Variants } from 'motion/react';

interface TimerProps {
  phase: InterviewPhase;
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

const InterviewTimer = ({ phase }: TimerProps) => {
  const interveiwTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [remainingTime, setRemainingTime] = useState<number>(0);

  const startTimer = () => {
    clearTimer();

    interveiwTimerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        const next = prev - 1;
        return next >= 0 ? next : 0;
      });
    }, 1000);
  };

  const clearTimer = () => {
    if (interveiwTimerRef.current) {
      clearInterval(interveiwTimerRef.current);
      interveiwTimerRef.current = null;
    }
  };

  useEffect(() => {
    switch (phase) {
      case 'startCountdown3':
        clearTimer();
        setRemainingTime(180);
        break;
      case 'answering':
        startTimer();
        break;
      case 'submitting':
        clearTimer();
        break;
      case 'submitSuccess':
        setRemainingTime(600);
        break;
      case 'start':
        startTimer();
        break;
      case 'beforeStartLoading':
        setRemainingTime(600);
        break;
      default:
        clearTimer();
        break;
    }

    return () => {
      clearTimer();
    };
  }, [phase]);

  return (
    <motion.div
      className={`${styles.timerContainer} ${phase === 'answering' && remainingTime <= 20 ? styles.redAlram : ''}`}
      variants={variants}
      animate={phase}
    >
      <Clock size={14} color="white" />
      <p>{formatting(remainingTime)}</p>
    </motion.div>
  );
};

export default InterviewTimer;
