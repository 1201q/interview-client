'use client';

import { useAtomValue } from 'jotai';
import styles from './styles/question.module.css';
import {
  displayInterviewQuestionAtom,
  interviewQuestionsAtom,
} from '@/store/interview';
import StepIndicator from './StepIndicator';

import { AnimatePresence, motion } from 'motion/react';

const DisplayQuestion = () => {
  const questions = useAtomValue(interviewQuestionsAtom);
  const displayQuestion = useAtomValue(displayInterviewQuestionAtom);

  const questionIndex = questions.findIndex((q) => q.id === displayQuestion.id);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={displayQuestion.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={styles.container}
      >
        <p>{displayQuestion.question.question_text}</p>
        <StepIndicator length={questions.length} currentStep={questionIndex} />
      </motion.div>
    </AnimatePresence>
  );
};

export default DisplayQuestion;
