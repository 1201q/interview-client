'use client';

import { GeneratedQuestionItem, QuestionSection } from '@/utils/types/types';
import SelectableQuestionItem from './SelectableQuestionItem';
import styles from './styles/container.module.css';
import selectStyles from './styles/select.module.css';
import sharedStyles from './styles/shared.module.css';

import { ChevronUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion, Variants } from 'motion/react';

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

const minSelectedQuestionsCount = 3; // 최소 선택해야 하는 질문 개수
const maxSelectedQuestionsCount = 10; // 최대로 선택할수 있는 질문 개수

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

  const [selectedQuestions, setSelectedQuestions] = useState<
    GeneratedQuestionItem[]
  >([]);

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

  const selectedQuestionsCount = selectedQuestions.length;

  const isOutOfRange =
    selectedQuestionsCount < minSelectedQuestionsCount ||
    selectedQuestionsCount > maxSelectedQuestionsCount;

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
      <div className={`${styles.leftContainer}`}>
        <div className={selectStyles.stickyLeftContainer}>
          <motion.div variants={itemVariants}>
            <AnimatePresence initial={false} mode="wait">
              {/* 기본 */}
              {selectedQuestionsCount < 1 && (
                <motion.h1
                  key="header-default"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.06 }}
                >
                  면접 질문을 선택하세요
                </motion.h1>
              )}
              {/* 현재 선택개수가 최소구간 미만인 경우 */}
              {selectedQuestionsCount >= 1 &&
                selectedQuestionsCount < minSelectedQuestionsCount && (
                  <motion.h1
                    key="header-min-selected"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.06 }}
                  >
                    최소 {minSelectedQuestionsCount - selectedQuestionsCount}개
                    더 선택해야해요
                  </motion.h1>
                )}
              {/* 현재 선택개수가 최대개수 미만인 경우 (~까지 선택가능) */}
              {selectedQuestionsCount >= minSelectedQuestionsCount &&
                selectedQuestionsCount < maxSelectedQuestionsCount && (
                  <motion.h1
                    key="header-max-selected"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.06 }}
                  >
                    {maxSelectedQuestionsCount - selectedQuestionsCount}개 더
                    선택할 수 있어요
                  </motion.h1>
                )}
              {/* 최대에 도달 */}
              {selectedQuestionsCount >= maxSelectedQuestionsCount && (
                <motion.h1
                  key="header-limit-reached"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.06 }}
                >
                  최대 선택 개수에 도달했어요
                </motion.h1>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.p variants={itemVariants}>
            AI가 생성한 맞춤형 질문 중에서 연습하고 싶은 질문을 선택해주세요.
            선택한 질문들로 실제 면접과 같은 환경에서 연습할 수 있습니다.
          </motion.p>

          {/* 면접 정보 */}
          <motion.div
            variants={itemVariants}
            className={sharedStyles.interviewInfoContainer}
          >
            <p>면접 정보</p>
            <div className={sharedStyles.interviewInfoItemContainer}>
              <div className={sharedStyles.interviewInfoItem}>
                <span>선택된 질문</span>
                <p>{selectedQuestionsCount}개</p>
              </div>
              <div className={sharedStyles.interviewInfoItem}>
                <span>예상 소요시간</span>
                <p>-</p>
              </div>
              <div className={sharedStyles.interviewInfoItem}>
                <span>총 생성된 질문</span>
                <p>{props.questions.length}개</p>
              </div>
            </div>
            {/* 버튼 */}
            <div
              className={`${styles.buttonContainer} ${sharedStyles.interviewButtonContainer}`}
            >
              <button disabled={isOutOfRange}>
                {isOutOfRange ? '질문을 선택해주세요' : '다음 단계로 넘어가기'}
              </button>
            </div>
          </motion.div>
          {/* 면접 팁 */}
          <motion.div
            variants={itemVariants}
            className={sharedStyles.tipContainer}
          >
            <div className={sharedStyles.header}>
              <h4>💡 면접 팁</h4>
            </div>
            <ul>
              <li>• 각 질문당 2-3분 정도의 답변을 준비하세요</li>
              <li>• 구체적인 경험과 사례를 포함해 답변하세요</li>
              <li>• 질문의 유형과 근거를 참고해 답변을 준비하세요</li>
            </ul>
          </motion.div>
        </div>
      </div>
      <div
        className={styles.rightContainer}
        style={{ justifyContent: 'flex-start' }}
      >
        {Object.entries(groupedQuestions).map(([section, items]) => {
          const isOpen = openSections[section] ?? true;

          return (
            <motion.div
              variants={itemVariants}
              className={selectStyles.listContainer}
              key={section}
            >
              <motion.div
                whileTap={{ scale: 0.98 }}
                whileHover={{ backgroundColor: 'var(--main-gray-hover-color)' }}
                className={selectStyles.title}
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
                    className={selectStyles.listItemContainer}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: 'easeInOut',
                    }}
                  >
                    {items.map((item, index) => (
                      <SelectableQuestionItem
                        key={item.id}
                        id={item.id}
                        selected={
                          selectedQuestions.findIndex(
                            (si) => si.id === item.id,
                          ) !== -1
                        }
                        onClick={() => {
                          setSelectedQuestions((prev) => {
                            if (
                              prev.findIndex((si) => si.id === item.id) !== -1
                            ) {
                              return prev.filter((si) => si.id !== item.id);
                            } else {
                              return [...prev, item];
                            }
                          });
                        }}
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
        })}
      </div>
    </motion.div>
  );
};

export default SelectPage;
