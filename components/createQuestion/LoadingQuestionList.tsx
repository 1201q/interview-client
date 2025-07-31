import { AnimatePresence, motion } from 'motion/react';
import styles from './styles/loading-list.module.css';
import { GeneratedQuestionItem } from '@/utils/types/types';
import LoadingQuestionItem from './LoadingQuestionItem';
import { useEffect, useRef, useState } from 'react';

const MAX_VISIBLE = 3;

const LoadingQuestionList = ({
  questions,
}: {
  questions: GeneratedQuestionItem[];
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  const isOverflow = questions.length > MAX_VISIBLE - 1;

  useEffect(() => {
    if (containerRef.current) {
      const children = Array.from(
        containerRef.current.children,
      ) as HTMLElement[];

      // visible 개수만큼 높이 계산
      const visibleItems = children.slice(
        Math.max(0, children.length - MAX_VISIBLE),
      );

      const newHeight = visibleItems.reduce(
        (sum, el) => sum + el.offsetHeight + 15,
        0,
      );
      setContainerHeight(newHeight);

      // 초과된 항목의 높이만큼 translateY 계산
      const overflowItems = children.slice(0, children.length - MAX_VISIBLE);
      const offset = overflowItems.reduce(
        (sum, el) => sum + el.offsetHeight + 15,
        0,
      );
      setTranslateY(offset);
    }
  }, [questions]);

  return (
    <div
      className={styles.loadingListContainer}
      style={{
        height: containerHeight || 'auto',
        overflow: isOverflow ? 'hidden' : 'visible',
      }}
    >
      {isOverflow && <div className={styles.fadeTop}></div>}
      {isOverflow && <div className={styles.fadeBottom}></div>}
      <motion.div
        ref={containerRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
        animate={{ y: isOverflow ? -translateY : 0 }}
        transition={{ type: 'spring', stiffness: 70, damping: 20 }}
      >
        <AnimatePresence initial={false}>
          {questions.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 70, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.3, damping: 20, type: 'spring' }}
            >
              <LoadingQuestionItem
                index={index}
                questionSection={item.section}
                questionText={item.text}
                basedOnText={item.based_on}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LoadingQuestionList;
