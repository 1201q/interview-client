'use client';

import { AnimatePresence, motion } from 'motion/react';
import SelectLoading from '../beforeInterview/selectPage/SelectLoading';
import { useEffect, useState } from 'react';
import {
  createInterviewJobRole,
  createInterviewSttKeywords,
  getInterviewSessionDetail,
} from '@/utils/services/interviewSession';

interface InterviewPipelineClientProps {
  sessionId: string;
}

type LoadingStatus = 'beforeLoading' | 'loading' | 'error' | 'completed';

const InterviewPipelineClient = ({
  sessionId,
}: InterviewPipelineClientProps) => {
  return (
    <AnimatePresence mode="wait">
      {/* {
        <motion.div
          style={{
            height: '100%',
            display: 'flex',
          }}
        >
          <SelectLoading />
        </motion.div>
      } */}
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
