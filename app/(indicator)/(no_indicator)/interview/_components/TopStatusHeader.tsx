'use client';

import styles from './styles/top.status.module.css';
import Clock from '@/public/clock.svg';
import { AnimatePresence, motion } from 'motion/react';
import Timer from './Timer';
import { useAtomValue } from 'jotai';
import {
  interviewClientStatusAtom,
  interviewSessionStatusAtom,
} from '@/store/interview';

interface Props {
  readySec: number;
  interviewSec: number;
}

const TopStatusHeader = ({ readySec, interviewSec }: Props) => {
  const clientStatus = useAtomValue(interviewClientStatusAtom);
  const sessionStatus = useAtomValue(interviewSessionStatusAtom);

  return (
    <div className={styles.container}>
      {clientStatus === 'answering' && <Recording />}
      {clientStatus === 'waiting30' && <Status text="준비 중" />}
      <AnimatePresence>
        {sessionStatus === 'in_progress' && clientStatus === 'waiting30' && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.45, type: 'spring' }}
            exit={{ x: -100, opacity: 0 }}
            className={`${styles.status} ${styles.remainingTime}`}
          >
            <Clock />
            <span>준비 시간</span>

            <Timer
              time={readySec}
              onTimeOver={() => {
                console.log(30);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {clientStatus === 'answering' && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.45, type: 'spring' }}
            exit={{ x: -100, opacity: 0 }}
            className={`${styles.status} ${styles.remainingTime}`}
          >
            <Clock />
            <span>남은 시간</span>

            <Timer
              time={interviewSec}
              onTimeOver={() => {
                console.log(60);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Status = ({ text }: { text: string }) => {
  return (
    <div className={styles.status}>
      <div className={`${styles.dot}`}></div>
      <p>{text}</p>
    </div>
  );
};

const Recording = () => {
  return (
    <div className={styles.status}>
      <div className={`${styles.dot} ${styles.red} ${styles.blink}`}></div>
      <p>면접 중</p>
    </div>
  );
};

export default TopStatusHeader;
