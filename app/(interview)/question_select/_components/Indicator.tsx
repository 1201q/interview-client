'use client';

import { useEffect, useState } from 'react';
import styles from './styles/indicator.module.css';
import Check from '@/public/check.svg';
import { usePathname } from 'next/navigation';

const STAGE = [
  { name: '질문 선택', link: '/question_select' },
  { name: '환경 체크', link: '/device_check' },
  { name: '면접', link: '/interview' },
  { name: '분석 결과', link: '/processing' },
];

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
  const pathname = usePathname();
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const currentIndex = STAGE.findIndex((data) =>
      pathname.startsWith(data.link),
    );

    if (currentIndex !== -1) {
      setCurrentStageIndex(currentIndex);
    } else {
      setCurrentStageIndex(-1);
    }
  }, [pathname]);

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
    <>
      {currentStageIndex !== -1 && (
        <div className={styles.container}>
          <div className={styles.topContainer}>
            <p>{STAGE[currentStageIndex].name}</p>
            <div>현재 {currentStageIndex + 1} / 4</div>
          </div>
          <div className={styles.barContainer}>
            <div className={styles.bar} style={{ width: `${barWidth}%` }}></div>
          </div>
          <div className={styles.stageContainer}>
            {STAGE.map((stage, index) => (
              <Stage
                key={stage.name}
                stageNumber={index + 1}
                stageText={stage.name}
                status={getStatus(index)}
                isLastStage={index === STAGE.length - 1}
              />
            ))}
          </div>
          <div className={styles.bottomContainer}></div>
        </div>
      )}
    </>
  );
};

export default Indicator;
