import styles from './styles/interview-question.module.css';
import { useEffect, useRef, useState } from 'react';

import { LayoutGroup, motion } from 'motion/react';
import { QUESTION_MOCK_DATA } from '@/utils/constants/question.mock';

interface QuestionItemProps {
  titleText: string;
  text: string;
  itemType?: 'default' | 'blue';
}

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
    itemType === 'blue' ? styles.blueQuestionItem : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      layout
      className={itemStyle}
      onClick={() => setExpanded((v) => !v)}
      // whileHover={{ backdropFilter: ""}}
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
        {!expanded && isOverflowing && itemType !== 'blue' && (
          <div className={styles.fadeShadow}></div>
        )}
      </motion.div>
    </motion.div>
  );
};

const InterviewQuestionList = () => {
  const [questions, setQuestions] = useState(QUESTION_MOCK_DATA);

  return (
    <div className={styles.questionListContainer}>
      <div className={styles.fixedContainer}>
        <CollapsibleQuestionItem
          titleText={'현재 질문'}
          text={questions[0].text}
          itemType="blue"
        />
      </div>
      <LayoutGroup>
        <motion.div
          layout
          layoutScroll
          className={styles.questionItemContainer}
        >
          {questions.map((q, index) => (
            <CollapsibleQuestionItem
              key={q.id}
              titleText={`질문 ${index + 1}`}
              text={q.text}
            />
          ))}
        </motion.div>
      </LayoutGroup>
      <div className={styles.bottomContainer}>
        <div className={styles.bottomStatus}>
          <div className={styles.title}>완료:</div>
          <div className={styles.text}>3개</div>
        </div>
        <div className={styles.bottomStatus}>
          <div className={styles.title}>남은 질문:</div>
          <div className={styles.text}>5개</div>
        </div>
      </div>
    </div>
  );
};

export default InterviewQuestionList;
