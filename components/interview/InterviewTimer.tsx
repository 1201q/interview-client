import styles from './styles/interview-timer.module.css';
import { Clock } from 'lucide-react';

const InterviewTimer = () => {
  return (
    <div className={styles.timerContainer}>
      <Clock size={14} color="white" />
      <p>2:59</p>
    </div>
  );
};

export default InterviewTimer;
