import styles from './styles/top.status.module.css';
import Clock from '@/public/clock.svg';

import { AnimatePresence, motion } from 'motion/react';
import Timer from './Timer';

interface Props {
  start: boolean;
}

const TopStatusHeader = ({ start }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.status}>
        <div
          className={`${styles.dot} ${start ? styles.red : ''} ${start ? styles.blink : ''}`}
        ></div>
        <p>{start ? '녹화중' : '준비중'}</p>
      </div>
      <AnimatePresence>
        {start && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.45, type: 'spring' }}
            className={`${styles.status} ${styles.remainingTime}`}
          >
            <Clock />
            <span>남은 시간</span>

            <Timer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopStatusHeader;
