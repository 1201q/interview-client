'use client';

import styles from './styles/step.indicator.module.css';

interface Props {
  length: number;
  currentStep: number;
}

const StepIndicator = ({ length, currentStep }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.indicatorContainer}>
        {Array.from({ length }, (_, index) => (
          <div
            className={`${currentStep === index ? styles.current : styles.dot}`}
            key={index}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
