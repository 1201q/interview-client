import Button from '@/components/common/Button';
import styles from './styles/mic.check.module.css';
import { MicIcon, CheckCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useStt } from './hooks/useStt';
import { useAtom } from 'jotai';
import { micCheckCompletedAtom } from '@/store/step';
import { micPermission$ } from '@/store/observable';

type Status = 'init' | 'recording' | 'success' | 'fail';

const MicCheck = () => {
  const [recordingStatus, setRecordingStatus] = useState<Status>('init');
  const [countdown, setCountdown] = useState(4);
  const { isLoading, isRecording, startRecording, stopRecording, text } =
    useStt();
  const [, setCompleted] = useAtom(micCheckCompletedAtom);
  const [micPermission, setMicPermission] = useState<PermissionState | null>(
    null,
  );

  const validate = (t: string | null) =>
    !!(t && t.replaceAll(' ', '').startsWith('안녕하세요'));

  const requestMicPermission = async () => {
    try {
      const status = await navigator.permissions.query({
        name: 'microphone' as PermissionName,
      });

      if (status.state === 'granted' || status.state === 'denied') {
        return status.state;
      }

      await navigator.mediaDevices.getUserMedia({ audio: true });
      return status.state;
    } catch (error) {
      return 'denied';
    }
  };

  useEffect(() => {
    const mic = micPermission$.subscribe((p) => {
      setMicPermission(p);
    });

    return () => {
      mic.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (recordingStatus !== 'recording') return;

    setCountdown(4);
    startRecording();

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [recordingStatus]);

  useEffect(() => {
    if (text === null || isRecording || isLoading) return;

    const result = validate(text);
    setCompleted(result);
    setRecordingStatus(result ? 'success' : 'fail');
  }, [text, isRecording, isLoading]);

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <p>안녕하세요</p>
        <span>위 문장을 마이크에 대고 말씀해주세요</span>
      </div>

      {recordingStatus === 'init' && micPermission === 'granted' && (
        <div className={styles.buttonContainer}>
          <Button
            text="음성 인식 시작"
            color="black"
            disabled={false}
            onClick={() => setRecordingStatus('recording')}
            icon={<MicIcon style={{ stroke: 'white', fill: 'none' }} />}
          />
        </div>
      )}
      {recordingStatus === 'init' && micPermission === 'prompt' && (
        <div className={styles.buttonContainer}>
          <Button
            text="마이크 권한 요청"
            color="black"
            disabled={false}
            onClick={requestMicPermission}
            icon={<MicIcon style={{ stroke: 'white', fill: 'none' }} />}
          />
        </div>
      )}
      {recordingStatus === 'init' && micPermission === 'denied' && (
        <div className={styles.buttonContainer}>
          <Button
            text="브라우저 설정에서 권한을 직접 허용해주세요"
            color="black"
            disabled={true}
          />
        </div>
      )}

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
            <p>
              {isLoading ? '분석하고 있어요...' : '듣고 있어요...'}{' '}
              {!isLoading && `${countdown - 1}초`}
            </p>
            {!isLoading && <span>&quot;안녕하세요&quot; 라고 말해주세요</span>}
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
          </div>
        </motion.div>
      )}

      {recordingStatus === 'fail' && (
        <>
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
          <div className={styles.retryButtonContainer}>
            <Button
              text="다시 시도"
              disabled={false}
              onClick={() => setRecordingStatus('init')}
              icon={
                <RefreshCw style={{ stroke: 'black', marginRight: '4px' }} />
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MicCheck;
