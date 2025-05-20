'use client';

import { useEffect, useState } from 'react';
import styles from './styles/countdown.module.css';
import { motion } from 'motion/react';

const Countdown = () => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown === 0) {
      console.log('321');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.container}
    >
      {countdown === 3 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={styles.countdownContainer}
        >
          <p>{countdown}</p>
        </motion.div>
      )}
      {countdown === 2 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={styles.countdownContainer}
        >
          <p>{countdown}</p>
        </motion.div>
      )}
      {countdown === 1 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={styles.countdownContainer}
        >
          <p>{countdown}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Countdown;
