import styles from './styles/interview-transcribe.module.css';
import { useEffect } from 'react';

import { motion } from 'motion/react';
import { Transcript } from '@/utils/types/types';

interface TranscribeProps {
  rawStableData: Transcript[];
  canResume: boolean;
}

const InterviewTranscribe = ({ rawStableData, canResume }: TranscribeProps) => {
  useEffect(() => {
    const fullText = rawStableData.map((d) => d.transcript).join(' ');

    console.log(fullText);
  }, [rawStableData]);

  return (
    <div className={styles.transcribeContainer}>
      <div className={styles.transribeTextContainer}>
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
      {canResume && (
        <div className={styles.bottomContainer}>
          <motion.div className={`${styles.transcribe} ${styles.ing}`}>
            듣고 있어요..
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default InterviewTranscribe;
