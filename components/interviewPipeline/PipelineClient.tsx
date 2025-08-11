'use client';

import useCreateQuestion from '@/utils/hooks/useCreateQuestion';
import InputPage from './InputPage';
import LoadingPage from './LoadingPage';

import { AnimatePresence, motion } from 'motion/react';

const PipelineClient = () => {
  const props = useCreateQuestion();

  return (
    <AnimatePresence mode="wait">
      {props.stage === 'input' && (
        <motion.div
          key="input"
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.15 }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <InputPage props={props} />
        </motion.div>
      )}

      {props.stage === 'loading' && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.15 }}
          style={{ display: 'flex', flex: 1, justifyContent: 'center' }}
        >
          <LoadingPage onLoadingComplete={props.onLoadingComplete} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PipelineClient;
