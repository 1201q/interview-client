import { GeneratedQuestionItem, QuestionSection } from '@/utils/types/types';
import { ChevronUp } from 'lucide-react';
import { AnimatePresence, motion, Variants } from 'motion/react';
import SelectableItem from './SelectItem';

import styles from './styles/select-list.module.css';
import { useSetAtom } from 'jotai';
import { toggleSelectedQuestionsAtom } from '@/store/selectedQuestions';

interface SelectItemListProps {
  itemVariants: Variants;
  toggleSection: (section: string) => void;
  section: string;
  isOpen: boolean;
  allItems: GeneratedQuestionItem[];
  selectedItems: GeneratedQuestionItem[];
}

const SelectItemList = ({
  itemVariants,
  toggleSection,
  section,
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
    <motion.div variants={itemVariants} className={styles.listContainer}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        whileHover={{ backgroundColor: 'var(--main-gray-hover-color)' }}
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
            className={styles.listItemContainer}
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

export default SelectItemList;
