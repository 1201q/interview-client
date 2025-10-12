'use client';

import styles from './styles/r.sidebar.module.css';

import { motion } from 'motion/react';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { AnalysesStatusesDto } from '@/utils/types/analysis';

interface ResultItemProps {
  sessionId: string;
  id: string;
  order: number;
  text: string;
}

interface SidebarProps {
  data: AnalysesStatusesDto;
}

const ResultSidebar = ({ data }: SidebarProps) => {
  return (
    <nav className={styles.sidebar}>
      <div className={`${styles.topStatus}`}>
        <p className={styles.topStatusTitle}>{'좋은 점수에요'}</p>
        <p className={styles.topStatusInfo}>85점</p>
      </div>
      <p className={styles.listHeader}>질문 목록</p>
      <div className={styles.questionList}>
        <ol className={styles.list}>
          {data.statuses.map((s) => (
            <li key={s.answer_id}>
              <ResultItem
                sessionId={data.session_id}
                id={s.answer_id}
                order={s.order}
                text={s.question_text}
              />
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

const ResultItem = ({ id, sessionId, order, text }: ResultItemProps) => {
  const className = [styles.question, styles.completed]
    .filter(Boolean)
    .join(' ');

  return (
    <Link href={`/result/${sessionId}/${id}`} className={className}>
      <div className={styles.questionTitle}>
        <div className={styles.leftTitle}>
          <span>답변한 질문</span>
          <p className={styles.questionOrder}>{order + 1}</p>
        </div>
        <div className={styles.rightTitle}>{}</div>
      </div>
      <div className={styles.questionText}>{text}</div>
    </Link>
  );
};

export default ResultSidebar;
