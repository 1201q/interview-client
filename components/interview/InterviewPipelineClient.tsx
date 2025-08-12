'use client';

import { AnimatePresence } from 'motion/react';
import InterviewPage from './InterviewPage';

const InterviewPipelineClient = () => {
  return (
    <AnimatePresence mode="wait">
      <InterviewPage />
    </AnimatePresence>
  );
};

export default InterviewPipelineClient;
