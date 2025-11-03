'use client';

import styles from './styles/f.sidebar.module.css';

import Link from 'next/link';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
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
      <LayoutGroup id="sidebar">
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
      </LayoutGroup>
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
    <Link href={`/feedback/${sessionId}/${id}`} className={className}>
      <AnimatePresence mode="sync">
        {selected && (
          <motion.span
            layoutId="sidebar-row-highlight"
            layout="position"
            className={styles.highlightBg}
            transition={{ ease: [0.22, 0.61, 0.36, 1], duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <span className={styles.questionOrder}>Q{order + 1}.</span>
      <p className={styles.questionText}>{text}</p>
    </Link>
  );
};

export default FeedbackSidebar;
