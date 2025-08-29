'use client';
import { QUESTION_MOCK_DATA } from '@/utils/constants/question.mock';
import AnalyzeAnswerItem from './AnalyzeAnswerItem';
import styles from './styles/analyze.module.css';
import { LayoutGroup } from 'motion/react';
import { useState } from 'react';

const AnalyzePage = () => {
  const mock = QUESTION_MOCK_DATA.slice(0, 5);

  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  return (
    <div className={styles.analyzeContainer}>
      <LayoutGroup>
        <div className={styles.AnswerFeedbackListContainer}>
          {mock.map((m, i) => (
            <AnalyzeAnswerItem
              key={m.id}
              order={i}
              text={m.text}
              toggleItem={() => {
                setExpandedIds((prev) => {
                  if (prev.includes(m.id)) {
                    return prev.filter((p) => p !== m.id);
                  } else {
                    return [...prev, m.id];
                  }
                });
              }}
              expanded={expandedIds.includes(m.id)}
            />
          ))}
        </div>
      </LayoutGroup>
    </div>
  );
};

export default AnalyzePage;
