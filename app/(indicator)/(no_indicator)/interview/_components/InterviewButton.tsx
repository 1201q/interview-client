'use client';

import Loading from '@/components/common/Loading';
import styles from './styles/interview.button.module.css';
import Play from '@/public/play.svg';
import Stop from '@/public/stop.svg';

import { useAtom, useAtomValue } from 'jotai';
import {
  interviewClientStatusAtom,
  interviewSessionStatusAtom,
} from '@/store/interview';

import { motion } from 'motion/react';

interface Props {
  loading: boolean;
  onInterviewStart: () => Promise<void>;
  onAnswerSubmit: () => Promise<void>;
}

interface ButtonProps {
  loading: boolean;
  onClick?: () => void;
}

const InterviewButton = ({
  loading,
  onAnswerSubmit,
  onInterviewStart,
}: Props) => {
  const sessionStatus = useAtomValue(interviewSessionStatusAtom);
  const [clientStatus, setClientStatus] = useAtom(interviewClientStatusAtom);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
    >
      {sessionStatus === 'pending' && (
        <ReadyButton loading={loading} onClick={onInterviewStart} />
      )}
      {clientStatus === 'answering' && (
        <StopButton loading={loading} onClick={onAnswerSubmit} />
      )}
      {sessionStatus === 'in_progress' && clientStatus === 'waiting30' && (
        <StartAnsweringButton
          loading={loading}
          onClick={() => setClientStatus('countdown')}
        />
      )}
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

export default InterviewButton;
