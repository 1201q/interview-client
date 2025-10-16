'use client';

import styles from './styles/r.sidebar.module.css';

import Link from 'next/link';
import { AnalysesStatusesDto } from '@/utils/types/analysis';
import { useParams } from 'next/navigation';

interface ResultItemProps {
  sessionId: string;
  id: string;
  order: number;
  text: string;
  selected: boolean;
}

interface SidebarProps {
  data: AnalysesStatusesDto;
}

const ResultSidebar = ({ data }: SidebarProps) => {
  const selectedAnswerId = useParams().answerId;

  return (
    <nav className={styles.sidebar}>
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
                selected={s.answer_id === selectedAnswerId}
              />
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

const ResultItem = ({
  id,
  sessionId,
  order,
  text,
  selected,
}: ResultItemProps) => {
  const className = [
    styles.question,
    styles.completed,
    selected ? styles.selected : '',
  ]
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
