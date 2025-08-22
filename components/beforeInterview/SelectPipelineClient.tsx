'use client';

import { AnimatePresence, motion } from 'motion/react';
import SelectPage from './SelectPage';
import { GeneratedQuestionItem } from '@/utils/types/types';
import { useState } from 'react';
import SelectLoading from './selectPage/SelectLoading';

interface SelectPageProps {
  questions: GeneratedQuestionItem[];
}

const SelectPipelineClient = (props: SelectPageProps) => {
  const [stage, setStage] = useState<'select' | 'loading'>('select');

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="input"
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.15 }}
        style={{ display: 'flex', flex: 1, justifyContent: 'center' }}
      >
        <SelectPage {...props} />
      </motion.div>

      {stage === 'select' && <SelectLoading />}
    </AnimatePresence>
  );
};

export default SelectPipelineClient;
