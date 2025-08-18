import styles from './styles/interview-question.module.css';
import { useEffect, useRef, useState } from 'react';

import { LayoutGroup, motion } from 'motion/react';
import { QUESTION_MOCK_DATA } from '@/utils/constants/question.mock';

type Question = (typeof QUESTION_MOCK_DATA)[number] & { order: number };

// list props
interface QuestionListProps {
  questions: Question[];
  currentQuestion: Question | null;
  nextQuestion: Question | null;
  submittedQuestions: Question[];
}

// item props
interface QuestionItemProps {
  titleText: string;
  text: string;
  itemType?: 'default' | 'blue' | 'green';
}

const InterviewQuestionList = ({
  questions,
  currentQuestion,
  nextQuestion,
  submittedQuestions,
}: QuestionListProps) => {
  const completedQuestionCount = submittedQuestions.length;
  const remainingQuestionCount = questions.length - submittedQuestions.length;

  return (
    <div className={styles.questionListContainer}>
      <div className={styles.fixedContainer}>
        {currentQuestion && (
          <CollapsibleQuestionItem
            titleText={'현재 질문'}
            text={currentQuestion.text}
            itemType="blue"
          />
        )}
      </div>
      <LayoutGroup>
        <motion.div
          layout
          layoutScroll
          className={styles.questionItemContainer}
        >
          {questions
            .filter(
              (q) =>
                q.id !== (currentQuestion && currentQuestion.id) &&
                !submittedQuestions.some((submitted) => submitted.id === q.id),
            )
            .map((q) => (
              <CollapsibleQuestionItem
                key={q.id}
                titleText={
                  q.id === nextQuestion?.id
                    ? '다음 질문'
                    : `질문 ${q.order + 1}`
                }
                text={q.text}
              />
            ))}
          {submittedQuestions.map((q) => (
            <CollapsibleQuestionItem
              key={`submitted-${q.id}`}
              titleText={`제출 완료한 질문`}
              text={q.text}
              itemType="green"
            />
          ))}
        </motion.div>
      </LayoutGroup>
      <div className={styles.bottomContainer}>
        <div className={styles.bottomStatus}>
          <div className={styles.title}>완료:</div>
          <div className={styles.text}>{completedQuestionCount}개</div>
        </div>
        <div className={styles.bottomStatus}>
          <div className={styles.title}>남은 질문:</div>
          <div className={styles.text}>{remainingQuestionCount}개</div>
        </div>
      </div>
    </div>
  );
};

const CollapsibleQuestionItem = ({
  text,
  titleText,
  itemType = 'default',
}: QuestionItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const clampLines = 2;

    // 2줄 높이 계산 (line-height 1.2 * font-size 13px ~= 15.6px)
    const thresholdHeight = 15.6;
    const maxClampedHeight = thresholdHeight * clampLines;

    setIsOverflowing(el.scrollHeight - 1 > maxClampedHeight);
  }, [text]);

  const itemStyle = [
    styles.questionItem,
    itemType === 'blue'
      ? styles.blueQuestionItem
      : itemType === 'green'
        ? styles.greenQuestionItem
        : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      layout
      className={itemStyle}
      onClick={() => setExpanded((v) => !v)}
      whileHover={{
        filter: itemType === 'default' ? 'brightness(130%)' : '',
      }}
    >
      <motion.div layout="position" className={styles.bigText}>
        {titleText}
      </motion.div>

      <motion.div layout="position" className={styles.textWrapper}>
        <div
          ref={textRef}
          className={`${styles.text} ${itemType !== 'blue' && !expanded ? styles.clamp : ''}`}
        >
          {text}
        </div>
        {!expanded && isOverflowing && itemType === 'default' && (
          <div className={styles.fadeShadow}></div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default InterviewQuestionList;
