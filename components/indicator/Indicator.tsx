'use client';

import CheckInfo from './CheckInfo';
import Info from './Info';
import SelectInfo from './SelectInfo';
import Step from './Step';
import styles from './styles/indicator.module.css';
import { STEP } from '@/utils/constants/interview.step';
import { usePathname } from 'next/navigation';

const Indicator = () => {
  const pathname = usePathname();
  const currentStep = pathname.split('/')[2];

  return (
    <div className={styles.container}>
      <div className={styles.contentsContainer}>
        <div className={styles.stepContainer}>
          {STEP.map((step, index) => (
            <Step
              key={step.name}
              name={step.name}
              current={step.page === currentStep}
              index={index + 1}
              flex={step.page === 'interview' ? 2 : undefined}
            />
          ))}
          <Info>
            {currentStep === 'select' && <SelectInfo />}
            {currentStep === 'check' && <CheckInfo />}
            {currentStep === 'interview' && <CheckInfo />}
          </Info>
        </div>
      </div>
    </div>
  );
};

export default Indicator;
