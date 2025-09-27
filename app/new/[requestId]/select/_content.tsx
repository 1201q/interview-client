'use client';

import { AnimatePresence, motion } from 'motion/react';
import styles from './select.module.css';
import Button from '@/components/new/Button';
import { GeneratedQuestionItem, QuestionSection } from '@/utils/types/types';
import { useMemo, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  selectedQuestionIdSetAtom,
  selectedQuestionsAtom,
  toggleSelectedQuestionsAtom,
} from '@/store/selectedQuestions';
import { ChevronUp, Check } from 'lucide-react';

interface NewSelectClientProps {
  questions: GeneratedQuestionItem[];
}

interface SelectItemListProps {
  toggleSection: (section: string) => void;
  section: string;
  isOpen: boolean;
  allItems: GeneratedQuestionItem[];
  selectedItems: GeneratedQuestionItem[];
}

interface SelectItemProps {
  index: number;

  questionText: string;
  basedOnText: string;
  questionSection: QuestionSection;
  id: string;
  onClick: () => void;
}

const NewSelectClient = ({ questions }: NewSelectClientProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      ['basic', 'experience', 'expertise', 'job_related'].forEach((key) => {
        initial[key] = true;
      });
      return initial;
    },
  );

  const selected = useAtomValue(selectedQuestionsAtom);

  const groupedQuestions = useMemo(() => {
    const sectionOrder = ['basic', 'experience', 'job_related', 'expertise'];
    const grouped = questions.reduce<Record<string, GeneratedQuestionItem[]>>(
      (acc, question) => {
        if (!acc[question.section]) {
          acc[question.section] = [];
        }
        acc[question.section].push({ ...question });
        return acc;
      },
      {},
    );

    const sortedGrouped: Record<string, GeneratedQuestionItem[]> = {};
    sectionOrder.forEach((section) => {
      if (grouped[section]) {
        sortedGrouped[section] = grouped[section];
      }
    });

    Object.keys(grouped).forEach((section) => {
      if (!sectionOrder.includes(section)) {
        sortedGrouped[section] = grouped[section];
      }
    });

    return sortedGrouped;
  }, [questions]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <>
      <div>
        <p className="stepText">STEP 4 OF 4</p>
        <p className="title">원하는 질문을 선택하세요</p>
        <p className="desc">
          인터뷰에 사용할 질문을 선택하세요. 해당 질문들로 인터뷰가 진행됩니다.
        </p>
      </div>
      <section className="content">
        {Object.entries(groupedQuestions).map(([section, items]) => {
          const isOpen = openSections[section] ?? true;

          return (
            <SelectableItemList
              key={section}
              toggleSection={toggleSection}
              section={section}
              isOpen={isOpen}
              selectedItems={selected}
              allItems={items}
            />
          );
        })}
      </section>
      <div className="buttons">
        <Button text="다음" disabled={false} />
      </div>
    </>
  );
};

const SelectableItemList = ({
  section,
  toggleSection,
  isOpen,
  selectedItems,
  allItems,
}: SelectItemListProps) => {
  const getBadgeText = (section: QuestionSection) => {
    switch (section) {
      case 'basic':
        return '기본';
      case 'experience':
        return '이력/경험';
      case 'expertise':
        return '전문기술';
      case 'job_related':
        return '직무';
      default:
        return '그외';
    }
  };

  const toggleQuestion = useSetAtom(toggleSelectedQuestionsAtom);

  return (
    <motion.div className={styles.list}>
      <motion.div
        whileTap={{ scale: 0.985 }}
        whileHover={{ backgroundColor: 'var(--neutral-2)' }}
        className={styles.title}
        onClick={() => toggleSection(section)}
      >
        {/* 섹션 타이틀 */}
        <p>{getBadgeText(section as QuestionSection)}</p>
        <motion.div
          animate={{ rotate: isOpen ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronUp />
        </motion.div>
      </motion.div>

      {/* 섹션 아이템들 */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key={`section-${section}`}
            className={styles.listItems}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
          >
            {allItems.map((item, index) => (
              <SelectableItem
                key={item.id}
                id={item.id}
                onClick={() => toggleQuestion(item)}
                index={index}
                questionSection={item.section as QuestionSection}
                questionText={item.text}
                basedOnText={item.based_on}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SelectableItem = ({
  onClick,
  basedOnText,
  questionSection,
  questionText,
  index,
  id,
}: SelectItemProps) => {
  const getBadgeStyle = (section: QuestionSection) => {
    switch (section) {
      case 'basic':
        return styles.blue;
      case 'experience':
        return styles.red;
      case 'expertise':
        return styles.violet;
      case 'job_related':
        return styles.green;
      default:
        return styles.blue;
    }
  };

  const selected = useAtomValue(selectedQuestionIdSetAtom).has(id);

  return (
    <div
      onClick={onClick}
      className={`${styles.item} ${selected ? styles.selected : ''}`}
    >
      <div className={styles.itemLeft}>
        <div className={styles.order}>{selected ? <Check /> : index + 1}</div>
      </div>
      <div className={styles.itemRight}>
        <p className={styles.questionText}>{questionText}</p>
        <div className={styles.row}>
          <p className={styles.basedonText}>{basedOnText}</p>
        </div>
      </div>
    </div>
  );
};

export default NewSelectClient;
