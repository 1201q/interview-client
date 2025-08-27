'use client';

import { AnimatePresence, motion } from 'motion/react';

import InterviewInit from './InterviewInit';
import { useAtom, useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { InterviewInitAtom, SessionIdAtom } from '@/store/interviewSession';
import InterviewPage from './InterviewPage';
import { useEffect } from 'react';

interface InterviewPipelineClientProps {
  sessionId: string;
}

const InterviewPipelineClient = ({
  sessionId,
}: InterviewPipelineClientProps) => {
  const interviewInit = useAtomValue(InterviewInitAtom);
  const sId = useAtomValue(SessionIdAtom);

  useHydrateAtoms([[SessionIdAtom, sessionId]], {
    dangerouslyForceHydrate: true,
  });

  if (!sId) return null;

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
          <InterviewPage />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InterviewPipelineClient;
