import Button from '@/components/common/Button';
import styles from './styles/mic.check.module.css';
import { MicIcon, CheckCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

type Status = 'init' | 'recording' | 'success' | 'fail';

const MicCheck = () => {
  const [recordingStatus, setRecordingStatus] = useState<Status>('init');
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (recordingStatus === 'recording') {
      setCountdown(4);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setRecordingStatus('fail');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [recordingStatus]);

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <p>안녕하세요</p>
        <span>위 문장을 마이크에 대고 말씀해주세요</span>
      </div>
      {recordingStatus === 'init' && (
        <div className={styles.buttonContainer}>
          <Button
            text="음성 인식 시작"
            disabled={false}
            color="black"
            onClick={() => setRecordingStatus('recording')}
            icon={<MicIcon style={{ stroke: 'white', fill: 'none' }} />}
          />
        </div>
      )}
      <div>
        {recordingStatus === 'recording' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`${styles.resultContainer} ${styles.blue}`}
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.15 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className={styles.recording}
            >
              <MicIcon style={{ stroke: 'white' }} />
            </motion.div>
            <div className={styles.recordingTextContainer}>
              <p>듣고 있어요... ({countdown - 1}초)</p>
              <span>&quot;안녕하세요&quot; 라고 말해주세요</span>
            </div>
          </motion.div>
        )}
        {recordingStatus === 'success' && (
          <motion.div
            initial={{ y: 30, opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            className={`${styles.resultContainer} ${styles.green}`}
          >
            <CheckCircle width={50} height={50} />
            <div className={styles.resultTextContainer}>
              <p>음성 인식 성공!</p>
              <span>다시 시도해주세요</span>
            </div>
          </motion.div>
        )}
        {recordingStatus === 'fail' && (
          <motion.div
            initial={{ y: 30, opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            className={`${styles.resultContainer} ${styles.red}`}
          >
            <CheckCircle width={50} height={50} />
            <div className={styles.resultTextContainer}>
              <p>음성 인식 실패</p>
              <span>다시 시도해주세요</span>
            </div>
          </motion.div>
        )}
      </div>
      {recordingStatus === 'fail' && (
        <div className={styles.retryButtonContainer}>
          <Button
            text="다시 시도"
            disabled={false}
            onClick={() => setRecordingStatus('init')}
            icon={
              <RefreshCw
                style={{ stroke: 'black', fill: 'none', marginRight: '4px' }}
              />
            }
          />
        </div>
      )}
    </div>
  );
};

export default MicCheck;
