'use client';

import styles from './styles/i.stt.module.css';

import { SpeechIcon } from 'lucide-react';

import { motion } from 'motion/react';

import { Transcript } from '@/utils/types/types';
import { useEffect, useRef } from 'react';

const InterviewSttDock = ({
  rawStableData,
}: {
  rawStableData: Transcript[];
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  }, [rawStableData?.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.sttDock}
    >
      <div className={styles.sttInner}>
        <div className={styles.sttIcon}>
          <SpeechIcon size={20} strokeWidth={1} />
        </div>

        <div className={styles.sttRight}>
          <h3>실시간 필사</h3>
          <div className={styles.sttScroll} ref={scrollRef}>
            {rawStableData?.length ? (
              rawStableData.map((s) => (
                <span key={`s-${s.item_id}`}>{s.transcript} </span>
              ))
            ) : (
              <span>이곳에 필사 텍스트가 표시됩니다</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewSttDock;
