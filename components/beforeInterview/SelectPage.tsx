'use client';

import { GeneratedQuestionItem } from '@/utils/types/types';

import styles from './styles/container.module.css';

import { useMemo, useState } from 'react';
import { motion, Variants } from 'motion/react';
import SelectGuide from './selectPage/SelectGuide';
import SelectableItemList from './selectPage/SelectItemList';
import { useAtomValue } from 'jotai';
import { selectedQuestionsAtom } from '@/store/selectedQuestions';

interface SelectPageProps {
  questions: GeneratedQuestionItem[];
}

// 등장 애니메이션
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // 자식간
      delayChildren: 0.1, // 첫 자식 시작까지 딜레이
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { stiffness: 80, type: 'spring' } },
};

const SelectPage = (props: SelectPageProps) => {
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
    return props.questions.reduce<Record<string, GeneratedQuestionItem[]>>(
      (acc, question) => {
        if (!acc[question.section]) {
          acc[question.section] = [];
        }

        acc[question.section].push({ ...question });
        return acc;
      },
      {},
    );
  }, [props.questions]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={styles.container}
    >
      <div className={styles.leftContainer}>
        <SelectGuide
          itemVariants={itemVariants}
          questionLength={props.questions.length}
        />
      </div>
      <div
        className={styles.rightContainer}
        style={{ justifyContent: 'flex-start' }}
      >
        {Object.entries(groupedQuestions).map(([section, items]) => {
          const isOpen = openSections[section] ?? true;

          return (
            <SelectableItemList
              key={section}
              itemVariants={itemVariants}
              toggleSection={toggleSection}
              section={section}
              isOpen={isOpen}
              selectedItems={selected}
              allItems={items}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

export default SelectPage;
