'use client';

import { useAtomValue } from 'jotai';
import styles from './styles/step.indicator.module.css';
import { currentQuestionAtom } from '@/store/interview';
import { totalQuestionsAtom } from '@/store/interview';

const StepIndicator = () => {
  const currentQuestion = useAtomValue(currentQuestionAtom);
  const totalQuestions = useAtomValue(totalQuestionsAtom);

  if (!totalQuestions) return null;
  if (!currentQuestion) return null;

  return (
    <div className={styles.container}>
      <div className={styles.indicatorContainer}>
        {Array.from({ length: totalQuestions }, (_, index) => (
          <div
            className={`${currentQuestion.question_order === index ? styles.current : styles.dot}`}
            key={index}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
