'use client';

import styles from './styles/f.sidebar.module.css';

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

const FeedbackSidebar = ({ data }: SidebarProps) => {
  const selectedAnswerId = useParams().answerId;

  return (
    <nav className={styles.sidebar}>
      <p className={styles.listHeader}>질문 목록</p>
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
    <Link
      href={`/feedback/${sessionId}/${id}`}
      scroll={true}
      className={className}
    >
      <div className={styles.questionTitle}>
        <span className={styles.questionOrder}>Q{order + 1}.</span>
        <p className={styles.questionText}>{text}</p>
      </div>
    </Link>
  );
};

export default FeedbackSidebar;
