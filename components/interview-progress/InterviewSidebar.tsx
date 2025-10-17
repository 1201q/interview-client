'use client';

import styles from './styles/i.sidebar.module.css';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useInterview } from './InterviewProvider';
import InterviewSidebarStatus from './InterviewSidebarStatus';

interface ResultItemProps {
  order: number;
  text: string;
  isOpen: boolean;
  isAnswering: boolean;
  isSubmitted: boolean;
  toggleItem: () => void;
}

const InterviewSidebar = () => {
  const { clientQuestions, currentQuestion, clientPhase } = useInterview();

  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      clientQuestions.forEach((q) => {
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

  useEffect(() => {
    if (currentQuestion) {
      setOpenQuestions((prev) => ({
        ...prev,
        [currentQuestion.id]: true,
      }));
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (clientPhase === 'submitSuccess' && currentQuestion) {
      setOpenQuestions((prev) => ({
        ...prev,
        [currentQuestion.id]: false,
      }));
    }
  }, [clientPhase]);

  return (
    <nav className={styles.sidebar}>
      {currentQuestion && (
        <InterviewSidebarStatus
          current={currentQuestion.order}
          total={clientQuestions.length}
        />
      )}
      {/* 질문 목록 */}
      <p className={styles.listHeader}>질문 목록</p>
      <ol className={styles.list}>
        {clientQuestions
          .sort((a, b) => a.order - b.order)
          .map((q) => {
            const isOpen = openQuestions[q.id];
            const isAnswering = currentQuestion?.id === q.id;
            const isSubmitted = q.status === 'submitted';

            return (
              <InterviewSidebarItem
                key={q.id}
                isOpen={isOpen}
                toggleItem={() => {
                  if (isAnswering) return;
                  toggleItem(q.id);
                }}
                text={q.text}
                order={q.order}
                isAnswering={isAnswering}
                isSubmitted={isSubmitted}
              />
            );
          })}
      </ol>
    </nav>
  );
};

const InterviewSidebarItem = ({
  order,
  text,
  isOpen,
  isAnswering,
  isSubmitted,
  toggleItem,
}: ResultItemProps) => {
  return (
    <button
      onClick={toggleItem}
      className={`${styles.question} ${isAnswering ? styles.selected : ''} ${isSubmitted ? styles.submitted : ''}`}
    >
      <div className={styles.questionTitle}>
        <span className={styles.questionOrder}>Q{order + 1}.</span>
        {isAnswering && <div className={`${styles.badge}`}>답변중</div>}
        {!isOpen && <p className={styles.questionText}>{text}</p>}
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
            <p className={styles.questionFullText}>{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default InterviewSidebar;
