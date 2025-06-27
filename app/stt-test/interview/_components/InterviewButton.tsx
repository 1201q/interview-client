'use client';

import Loading from '@/components/common/Loading';
import styles from './styles/interview.button.module.css';
import Play from '@/public/play.svg';
import Stop from '@/public/stop.svg';

import { useAtom } from 'jotai';
import { interviewClientStatusAtom } from '@/store/interview';

import { motion } from 'motion/react';

interface Props {
  loading: boolean;
  onInterviewStart: () => Promise<void>;
  onAnswerSubmit: () => Promise<void>;
  onInterviewComplete: () => Promise<void>;
}

interface ButtonProps {
  loading: boolean;
  onClick?: () => void;
}

const InterviewButton = ({
  loading,
  onAnswerSubmit,
  onInterviewStart,
  onInterviewComplete,
}: Props) => {
  const [clientStatus, setClientStatus] = useAtom(interviewClientStatusAtom);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
    >
      <ReadyButton loading={loading} onClick={onInterviewStart} />
    </motion.div>
  );
};

// 인터뷰 시작 전
const ReadyButton = ({ loading, onClick }: ButtonProps) => {
  return (
    <button
      disabled={loading}
      onClick={onClick}
      className={`${styles.container}`}
    >
      <div className={styles.flex}>
        {loading ? (
          <Loading size={25} color="white" />
        ) : (
          <div className={styles.playIcon}>
            <Play />
          </div>
        )}
        <p>시작하기</p>
      </div>
    </button>
  );
};

const StopButton = ({ loading, onClick }: ButtonProps) => {
  return (
    <button
      disabled={loading}
      onClick={onClick}
      className={`${styles.container} ${styles.red}`}
    >
      <div className={styles.flex}>
        {loading ? (
          <Loading size={25} color="white" />
        ) : (
          <div className={styles.playIcon}>
            <Stop />
          </div>
        )}
        <p>답변 종료</p>
      </div>
    </button>
  );
};

const StartAnsweringButton = ({ loading, onClick }: ButtonProps) => {
  return (
    <button
      disabled={loading}
      onClick={onClick}
      className={`${styles.container}`}
    >
      <div className={styles.flex}>
        {loading ? (
          <Loading size={25} color="white" />
        ) : (
          <div className={styles.playIcon}>
            <Play />
          </div>
        )}
        <p>답변 시작</p>
      </div>
    </button>
  );
};

const CompleteButton = ({ loading, onClick }: ButtonProps) => {
  return (
    <button
      disabled={loading}
      onClick={onClick}
      className={`${styles.container}`}
    >
      <div className={styles.flex}>
        {loading ? (
          <Loading size={25} color="white" />
        ) : (
          <div className={styles.playIcon}>
            <Play />
          </div>
        )}
        <p>결과 보기</p>
      </div>
    </button>
  );
};

export default InterviewButton;
