'use client';

import CheckPage from './CheckPage';
import useCreateQuestion from './hooks/useCreateQuestion';

import InputPage from './InputPage';
import LoadingPage from './LoadingPage';
import SelectPage from './SelectPage';

import { AnimatePresence, motion } from 'motion/react';

const TEST_ID = '4e88866e-2a7a-4e66-b49f-12a29e67109e';

const CreateQuestion = () => {
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

      {/* {props.stage === 'result' && (
        <motion.div
          key="result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.15 }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <SelectPage />
        </motion.div>
      )} */}

      {props.stage === 'check' && (
        <motion.div
          key="check"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.15 }}
          style={{ display: 'flex', flex: 1, justifyContent: 'center' }}
        >
          <CheckPage props={props} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateQuestion;
