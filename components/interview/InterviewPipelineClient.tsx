'use client';

import { AnimatePresence, motion } from 'motion/react';
import InterviewPage from './InterviewPage';
import SelectLoading from '../beforeInterview/selectPage/SelectLoading';
import { useEffect } from 'react';
import {
  createInterviewJobRole,
  createInterviewSttKeywords,
} from '@/utils/services/interviewSession';

interface InterviewPipelineClientProps {
  sessionId: string;
}

const InterviewPipelineClient = ({
  sessionId,
}: InterviewPipelineClientProps) => {
  useEffect(() => {
    createInterviewJobRole(sessionId);

    createInterviewSttKeywords(sessionId);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={'interviewLoading'}
        style={{
          height: '100%',
          display: 'flex',
        }}
      >
        <SelectLoading />
      </motion.div>
      {/* <motion.div
        key={'interview'}
        style={{
          height: '100%',
          display: 'flex',
        }}
      >
        <InterviewPage />
      </motion.div> */}
    </AnimatePresence>
  );
};

export default InterviewPipelineClient;
