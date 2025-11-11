'use client';

import { RubricItemDto } from '@/utils/types/analysis';
import styles from './styles/r.client.module.css';

interface TopInfoProps {
  rubric: RubricItemDto;
}

const TopInfo = ({ rubric }: TopInfoProps) => {
  const rubrics: Array<{
    key: keyof RubricItemDto;
    label: string;
    text: string | null;
  }> = [
    { key: 'context', label: '질문 생성 근거', text: rubric.context },
    { key: 'intent', label: '면접관 의도', text: rubric.intent },
    { key: 'required', label: '핵심 평가 요소', text: rubric.required },
    { key: 'optional', label: '보너스 평가 요소', text: rubric.optional },
  ];

  return (
    <div className={styles.questionInfos}>
      {rubrics.map((r) => (
        <div className={styles.container} key={r.key}>
          <div className={styles.questionInfo}>
            <p className={styles.title}>{r.label}</p>
            <p className={styles.desc}>{r.text ? r.text : '정보 없음'}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopInfo;
