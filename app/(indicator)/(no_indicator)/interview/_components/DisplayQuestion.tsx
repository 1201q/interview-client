'use client';

import { useAtomValue } from 'jotai';
import styles from './styles/question.module.css';
import {
  displayInterviewQuestionAtom,
  interviewQuestionsAtom,
  isLastQuestionAtom,
} from '@/store/interview';
import StepIndicator from './StepIndicator';

import { AnimatePresence, motion } from 'motion/react';

const DisplayQuestion = () => {
  const questions = useAtomValue(interviewQuestionsAtom);
  const displayQuestion = useAtomValue(displayInterviewQuestionAtom);
  const isLastQuestion = useAtomValue(isLastQuestionAtom);

  const questionIndex = questions.findIndex((q) => q.id === displayQuestion.id);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${displayQuestion.id}-${isLastQuestion ? '1' : '2'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`${styles.container} ${isLastQuestion ? styles.isLastQuestion : ''} `}
      >
        <p>
          {isLastQuestion
            ? '면접이 종료되었습니다.'
            : displayQuestion.question.question_text}
        </p>
        {!isLastQuestion && (
          <StepIndicator
            length={questions.length}
            currentStep={questionIndex}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default DisplayQuestion;
