import { useEffect, useState } from 'react';
import styles from './styles/top.status.module.css';

const TOTAL_TIME = 60;

const Timer = () => {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_TIME);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.timeContainer}>
      <p>
        {Math.floor(secondsLeft / 60)}:
        {String(secondsLeft % 60).padStart(2, '0')}
      </p>
    </div>
  );
};

export default Timer;
