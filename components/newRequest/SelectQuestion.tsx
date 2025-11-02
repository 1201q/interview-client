'use client';

import { AnimatePresence, motion } from 'motion/react';
import styles from './styles/q.select.module.css';
import Button from '@/components/shared/Button';
import { GeneratedQuestionItem, QuestionSection } from '@/utils/types/types';
import { useMemo, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  selectedQuestionIdSetAtom,
  selectedQuestionsAtom,
  toggleSelectedQuestionsAtom,
} from '@/store/selectedQuestions';
import { ChevronUp, Check } from 'lucide-react';
import { createInterviewSession } from '@/utils/services/interviewSession';
import { useRouter } from 'next/navigation';

interface NewSelectClientProps {
  questions: GeneratedQuestionItem[];
  requestId: string;
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

const MIN_SELECT_COUNT = 3;
const MAX_SELECT_COUNT = 10;

const SelectQuestion = ({ questions, requestId }: NewSelectClientProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      ['basic', 'experience', 'expertise', 'job_related'].forEach((key) => {
        initial[key] = true;
      });
      return initial;
    },
  );

  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);

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

  const isNextDisabled =
    selected.length < MIN_SELECT_COUNT || selected.length > MAX_SELECT_COUNT;

  const buttonText =
    selected.length < MIN_SELECT_COUNT
      ? `최소 ${MIN_SELECT_COUNT}개 선택 필요`
      : selected.length > MAX_SELECT_COUNT
        ? `최대 ${MAX_SELECT_COUNT}개 선택 가능`
        : '다음';

  const createSession = async () => {
    setSubmitting(true);

    try {
      if (selected.length < MIN_SELECT_COUNT) {
        setSubmitting(false);
        alert(`최소 ${MIN_SELECT_COUNT}개의 질문을 선택해주세요.`);
        return;
      } else if (selected.length > MAX_SELECT_COUNT) {
        setSubmitting(false);
        alert(`최대 ${MAX_SELECT_COUNT}개의 질문만 선택할 수 있습니다.`);
        return;
      }

      const res = await createInterviewSession({
        requestId,
        questions: selected.map((q, index) => ({
          question_id: q.id,
          order: index,
        })),
      });

      setSubmitting(false);

      router.replace(`/interview/${res.session_id}`);
    } catch (error) {
      setSubmitting(false);
      alert('문제가 발생했어요. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <div className={styles.main}>
        <p className={styles.title}>원하는 질문을 선택하세요</p>
        <p className={styles.desc}>
          인터뷰에 사용할 질문을 선택하세요. 해당 질문들로 인터뷰가 진행됩니다.
        </p>
        <section>
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
      </div>

      <div className={styles.buttons}>
        <motion.span layout>{selected.length}개 선택함</motion.span>
        <Button
          text={buttonText}
          disabled={isNextDisabled}
          loading={submitting}
          onClick={createSession}
        />
      </div>
    </>
  );
};

const SelectableItemList = ({
  section,
  toggleSection,
  isOpen,
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
        whileHover={{ backgroundColor: 'var(--neutral-1)' }}
        className={styles.toggleTitle}
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

  questionText,
  index,
  id,
}: SelectItemProps) => {
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

export default SelectQuestion;
