'use client';

import { RubricItemDto } from '@/utils/types/analysis';
import styles from './styles/r.client.module.css';
import { useState } from 'react';

interface TopInfoProps {
  rubric: RubricItemDto;
}

const TopInfo = ({ rubric }: TopInfoProps) => {
  const [selectedTab, setSelectedTab] =
    useState<keyof RubricItemDto>('context');

  const tabs: Array<{
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
    <div className={styles.container}>
      <ul className={styles.tabs}>
        {tabs.map((tab) => (
          <li
            className={`${styles.tab} ${selectedTab === tab.key ? styles.selected : ''}`}
            key={tab.key}
            onClick={() => {
              setSelectedTab(tab.key);
            }}
          >
            {tab.label}
          </li>
        ))}
      </ul>
      <div className={styles.questionInfo}>
        <p className={styles.title}>
          {tabs.find((t) => t.key === selectedTab)?.label}
        </p>
        <p className={styles.desc}>
          {tabs.find((t) => t.key === selectedTab)?.text || '정보가 없습니다.'}
        </p>
      </div>
    </div>
  );
};

export default TopInfo;
