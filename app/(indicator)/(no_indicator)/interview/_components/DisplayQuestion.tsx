'use client';

import { useAtomValue } from 'jotai';
import styles from './styles/question.module.css';
import { interviewClientStatusAtom } from '@/store/interview';
import StepIndicator from './StepIndicator';

import { AnimatePresence, motion } from 'motion/react';
import { currentQuestionAtom } from '@/store/interview';

const DisplayQuestion = () => {
  const clientStatus = useAtomValue(interviewClientStatusAtom);
  const currentQuestion = useAtomValue(currentQuestionAtom);

  if (!currentQuestion) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${currentQuestion.question_id}-${clientStatus === 'end' ? '1' : '2'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`${styles.container} ${clientStatus === 'end' ? styles.isLastQuestion : ''} `}
      >
        <p>
          {clientStatus === 'end'
            ? '면접이 종료되었습니다.'
            : currentQuestion.question_text}
        </p>
        {clientStatus !== 'end' && <StepIndicator />}
      </motion.div>
    </AnimatePresence>
  );
};

export default DisplayQuestion;
