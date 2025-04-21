'use client';

import { useState } from 'react';
import styles from './styles/indicator.module.css';
import Check from '@/public/check.svg';

const STAGE = ['질문 선택', '환경 체크', '면접', '분석 결과'];

interface StageProps {
  stageNumber: number;
  stageText: string;
  status: 'current' | 'done' | 'upcoming';
  isLastStage: boolean;
}

const Stage = ({ stageNumber, stageText, status, isLastStage }: StageProps) => {
  return (
    <div className={`${styles.stage} ${styles[status]}`}>
      <div className={styles.circle}>
        {status === 'done' ? <Check /> : <p>{stageNumber}</p>}
      </div>
      <p className={`${styles.stageText}`}>{stageText}</p>

      {!isLastStage && <span className={styles.line}></span>}
    </div>
  );
};

const Indicator = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const barWidth = Math.min(
    100,
    (100 / STAGE.length) * (currentStageIndex + 1),
  );

  const getStatus = (index: number) => {
    if (index === currentStageIndex) return 'current';
    if (index < currentStageIndex) return 'done';
    return 'upcoming';
  };

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <p>{STAGE[currentStageIndex]}</p>
        <div>현재 {currentStageIndex + 1} / 4</div>
      </div>
      <div className={styles.barContainer}>
        <div className={styles.bar} style={{ width: `${barWidth}%` }}></div>
      </div>
      <div className={styles.stageContainer}>
        {STAGE.map((stage, index) => (
          <Stage
            key={stage}
            stageNumber={index + 1}
            stageText={stage}
            status={getStatus(index)}
            isLastStage={index === STAGE.length - 1}
          />
        ))}
      </div>
      <div className={styles.bottomContainer}>
        <button
          onClick={() => {
            setCurrentStageIndex((prev) => prev + 1);
          }}
        >
          다음단계
        </button>
      </div>
    </div>
  );
};

export default Indicator;
