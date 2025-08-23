'use client';

import { AnimatePresence, motion } from 'motion/react';
import SelectPage from './SelectPage';
import { GeneratedQuestionItem } from '@/utils/types/types';

interface SelectPageProps {
  questions: GeneratedQuestionItem[];
}

const SelectPipelineClient = (props: SelectPageProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="select"
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.15 }}
        style={{ display: 'flex', flex: 1, justifyContent: 'center' }}
      >
        <SelectPage {...props} />
      </motion.div>
    </AnimatePresence>
  );
};

export default SelectPipelineClient;
