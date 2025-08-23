'use client';

import { AnimatePresence, motion } from 'motion/react';
import InterviewPage from './InterviewPage';

const InterviewPipelineClient = () => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={'interview'}
        style={{
          height: '100%',
          display: 'flex',
        }}
      >
        <InterviewPage />
      </motion.div>
    </AnimatePresence>
  );
};

export default InterviewPipelineClient;
