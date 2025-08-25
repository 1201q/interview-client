'use client';

import { AnimatePresence, motion } from 'motion/react';

import InterviewInit from './InterviewInit';
import { useAtomValue } from 'jotai';
import { InterviewInitAtom } from '@/store/interviewSession';
import InterviewPage from './InterviewPage';

interface InterviewPipelineClientProps {
  sessionId: string;
}

const InterviewPipelineClient = ({
  sessionId,
}: InterviewPipelineClientProps) => {
  const interviewInit = useAtomValue(InterviewInitAtom);

  return (
    <AnimatePresence mode="wait">
      {interviewInit !== 'completed' ? (
        <motion.div
          key="initPage"
          style={{
            height: '100%',
            display: 'flex',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <InterviewInit sessionId={sessionId} />
        </motion.div>
      ) : (
        <motion.div
          key="interviewPage"
          style={{
            height: '100%',
            display: 'flex',
          }}
        >
          <InterviewPage sessionId={sessionId} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InterviewPipelineClient;
