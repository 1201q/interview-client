'use client';

import {
  InterviewSessionStatus,
  QSessionQuestionItem,
  SessionQuestionStatus,
} from '@/utils/types/interview';
import styles from './styles/i.sidebar.module.css';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LoaderCircle } from 'lucide-react';

interface InterviewSidebarProps {
  questions: QSessionQuestionItem[];
  status: InterviewSessionStatus;
}

interface QuestionItemProps {
  isOpen: boolean;
  text: string;
  order: number;
  toggleItem: () => void;
  qStatus: SessionQuestionStatus;
}

const InterviewSidebar = ({ questions, status }: InterviewSidebarProps) => {
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      questions.forEach((q) => {
        initial[q.id] = false;
      });
      return initial;
    },
  );

  const toggleItem = (id: string) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <nav className={styles.sidebar}>
      <div className={styles.topStatus}>
        <p className={styles.topStatusTitle}>면접 진행 중</p>
        <p className={styles.topStatusInfo}>현재 0%</p>
      </div>
      <p className={styles.listHeader}>질문 목록</p>
      <div className={styles.questionList}>
        <ol className={styles.list}>
          {questions
            .sort((a, b) => a.order - b.order)
            .map((q) => {
              const isOpen = openQuestions[q.id];

              return (
                <QuestionItem
                  key={q.id}
                  isOpen={isOpen}
                  toggleItem={() => {
                    toggleItem(q.id);
                    console.log(q);
                  }}
                  text={q.text}
                  order={q.order}
                  qStatus={
                    q.order === 0
                      ? 'submitted'
                      : q.order === 1
                        ? 'answering'
                        : 'ready'
                  }
                />
              );
            })}
        </ol>
      </div>
    </nav>
  );
};

const QuestionItem = ({
  toggleItem,
  order,
  isOpen,
  text,
  qStatus,
}: QuestionItemProps) => {
  return (
    <li
      className={`${styles.question} ${qStatus === 'submitted' ? styles.completed : ''}`}
      onClick={toggleItem}
    >
      <div className={styles.questionTitle}>
        <div className={styles.leftTitle}>
          <span>질문</span>
          <p className={styles.questionOrder}>{order + 1}</p>
        </div>
        <div className={styles.rightTitle}>
          <QuestionItemStatus status={qStatus} />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ overflow: 'hidden' }}
            aria-hidden={!isOpen}
          >
            <div className={styles.questionText}>{text}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

const QuestionItemStatus = ({ status }: { status: SessionQuestionStatus }) => {
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

export default InterviewSidebar;
