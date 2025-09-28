'use client';

import {
  QSessionQuestionItem,
  SessionQuestionStatus,
} from '@/utils/types/interview';
import styles from './styles/r.sidebar.module.css';

import { motion } from 'motion/react';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { AnalysisData } from '@/utils/types/analysis';

interface ResultItemProps {
  id: string;
  order: number;
}

interface SidebarProps {
  data: AnalysisData[];
}

const ResultSidebar = ({ data }: SidebarProps) => {
  const ordered = [...data].sort((a, b) => a.order - b.order);

  return (
    <nav className={styles.sidebar}>
      <div className={`${styles.topStatus}`}>
        <p className={styles.topStatusTitle}>{'좋은 점수에요'}</p>
        <p className={styles.topStatusInfo}>85점</p>
      </div>
      <p className={styles.listHeader}>질문 목록</p>
      <div className={styles.questionList}>
        <ol className={styles.list}>
          {ordered.map((q) => (
            <li key={q.id}>
              <ResultItem id={q.id} order={q.order} />
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

const ResultItem = ({ id, order }: ResultItemProps) => {
  const className = [styles.question, styles.completed]
    .filter(Boolean)
    .join(' ');

  return (
    <Link href={`#${id}`} className={className}>
      <div className={styles.questionTitle}>
        <div className={styles.leftTitle}>
          <span>질문</span>
          <p className={styles.questionOrder}>{order + 1}</p>
        </div>
        <div className={styles.rightTitle}>{}</div>
      </div>
    </Link>
  );
};

const ResultItemScore = ({ status }: { status: SessionQuestionStatus }) => {
  if (status === 'ready') {
    return (
      <>
        <p className={`${styles.status} ${styles.ready}`}>답변할 질문</p>
      </>
    );
  } else if (status === 'submitted') {
    return (
      <>
        <p>제출한 질문</p>
      </>
    );
  } else if (status === 'answering') {
    return (
      <>
        <p className={`${styles.status} ${styles.answering}`}>답변중</p>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
          style={{ display: 'flex' }}
        >
          <LoaderCircle
            color="var(--color-primary)"
            size={20}
            strokeWidth={2}
          />
        </motion.div>
      </>
    );
  }

  return <div></div>;
};

export default ResultSidebar;
