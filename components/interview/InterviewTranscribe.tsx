import { useRealtimeTranscribe } from '@/utils/hooks/useRealtimeTranscribe';
import styles from './styles/interview-transcribe.module.css';
import { useEffect } from 'react';

import { motion } from 'motion/react';

const InterviewTranscribe = () => {
  const {
    connected,
    paused,
    canResume,
    rawStableData,
    start,
    flushAndStop,
    resetText,
    pauseTranscription,
    resumeTranscription,
    getTranscriptSnapshot,
    connectTranscription,
  } = useRealtimeTranscribe({
    onEvent: (e: any) => {
      console.log(e);
    },
  });

  useEffect(() => {
    const fullText = rawStableData.map((d) => d.transcript).join(' ');

    console.log(fullText);
  }, [rawStableData]);

  return (
    <>
      <div className={styles.transcribeContainer}>
        {/* <div className={styles.transribeTextContainer}>
          {rawStableData.map((data) => (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              key={data.item_id}
              className={styles.transcribe}
            >
              <div className={styles.textContainer}>{data.transcript}</div>
              <div className={styles.timeContainer}>0:40</div>
            </motion.div>
          ))}
        </div>
        {connected && (
          <div className={styles.bottomContainer}>
            <motion.div className={`${styles.transcribe} ${styles.ing}`}>
              듣고 있어요..
            </motion.div>
          </div>
        )} */}
      </div>
      <div
        style={{
          position: 'fixed',
          left: '0px',
          top: '30px',
          backgroundColor: 'gray',
        }}
      >
        <button onClick={() => connectTranscription()}>connect / </button>

        <button
          onClick={() => {
            console.log(flushAndStop());
          }}
        >
          종료
        </button>
        <button onClick={() => resetText()}>지워/</button>
        <button onClick={() => pauseTranscription()}>pause</button>
        <button onClick={() => resumeTranscription()}>resume</button>
        <button>{paused ? '정지됨' : '듣고 있음'}</button>
        <button
          onClick={() => {
            console.log(getTranscriptSnapshot());
          }}
        >
          getTranscriptSnapshot
        </button>
      </div>
    </>
  );
};

export default InterviewTranscribe;
