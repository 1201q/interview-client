import { useEffect, useState } from 'react';
import styles from './styles/top.status.module.css';

interface Props {
  time: number;
  onTimeOver?: () => void;
}

const Timer = ({ time, onTimeOver }: Props) => {
  const [secondsLeft, setSecondsLeft] = useState(time);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          if (onTimeOver) {
            setTimeout(() => {
              onTimeOver();
            }, 0);
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onTimeOver]);

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
