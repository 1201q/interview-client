'use client';

import {
  InterviewPhase,
  QSessionQuestionItem,
  SessionQuestionStatus,
} from '@/utils/types/interview';
import styles from './styles/i.sidebar.module.css';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LoaderCircle } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { SessionQuestionsAtom } from '@/store/interviewSession';

interface QuestionItemProps {
  isOpen: boolean;
  text: string;
  order: number;
  toggleItem: () => void;
  qStatus: SessionQuestionStatus;
}

type StatusType = 'not_started' | 'in_progress' | 'completed' | 'expired';

interface SidebarProps {
  questions: QSessionQuestionItem[];
  status: StatusType;
}

const InterviewSidebar = ({ questions, status }: SidebarProps) => {
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

  const statusText = (status: StatusType) => {
    switch (status) {
      case 'not_started':
        return '인터뷰 시작 전';
      case 'in_progress':
        return '인터뷰 진행 중';
      case 'completed':
        return '인터뷰 완료';
      case 'expired':
        return '인터뷰 기간 만료';
      default:
        return '';
    }
  };

  const progressPercent =
    questions.length === 0
      ? 0
      : (questions.filter((q) => q.status === 'submitted').length /
          questions.length) *
        100;

  return (
    <nav className={styles.sidebar}>
      <motion.div
        layout
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`${styles.topStatus} ${status !== 'in_progress' ? styles.nonProgress : ''}`}
      >
        <motion.p
          layout="position"
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className={styles.topStatusTitle}
        >
          {statusText(status)}
        </motion.p>
        <AnimatePresence initial={false} mode="popLayout">
          {status === 'in_progress' && (
            <motion.p
              key="topStatusInfo"
              className={styles.topStatusInfo}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              현재 {Math.floor(progressPercent)}%
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
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
                  qStatus={q.status}
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
