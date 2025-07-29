import { QuestionSection } from '@/utils/types/types';
import SelectableQuestionItem from './SelectableQuestionItem';
import styles from './styles/container.module.css';
import selectStyles from './styles/select.module.css';

import { ChevronUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { v4 as uuid } from 'uuid';

interface MockType {
  question: string;
  based_on: string;
  section: QuestionSection;
}

interface ItemType extends MockType {
  id: string;
}

export const MOCK_QUESTIONS: MockType[] = [
  {
    question:
      "채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요. 채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요.",
    based_on: "채용공고의 '고가용성 설계' 키워드",
    section: 'basic',
  },
  {
    question:
      "채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요. 채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요. ",
    based_on: "채용공고의 '고가용성 설계' 키워드",
    section: 'basic',
  },
  {
    question:
      "채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요.",
    based_on: "채용공고의 '고가용성 설계' 키워드",
    section: 'basic',
  },
  {
    question:
      "채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요.  주세요.",
    based_on: "채용공고의 '고가용성 설계' 키워드",
    section: 'experience',
  },
  {
    question:
      "채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요. 주세요.",
    based_on: "채용공고의 '고가용성 설계' 키워드",
    section: 'experience',
  },
  {
    question:
      "채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요.  주세요.",
    based_on: "채용공고의 '고가용성 설계' 키워드",
    section: 'experience',
  },
  {
    question:
      "채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요.",
    based_on: "채용공고의 '고가용성 설계' 키워드",
    section: 'experience',
  },
  {
    question:
      "채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히  채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요. 설명해 주세요.",
    based_on: "채용공고의 '고가용성 설계' 키워드",
    section: 'experience',
  },
  {
    question:
      "채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요.",
    based_on: "채용공고의 '고가용성 설계' 키워드",
    section: 'experience',
  },
  {
    question:
      "채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히  채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요. 설명해 주세요.",
    based_on: "채용공고의 '고가용성 설계' 키워드",
    section: 'experience',
  },
  {
    question:
      "채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요.  설명해 주세요.",
    based_on: "채용공고의 '고가용성 설계' 키워드",
    section: 'experience',
  },
  {
    question:
      "채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요.",
    based_on: "채용공고의 '고가용성 설계' 키워드",
    section: 'job_related',
  },
  {
    question:
      "자신이 팀 프로젝트에서 맡았채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요. 던 역할과 성과를 구체적으로 설명해 주세요.",
    based_on: "이력서의 '배움과 성장' 섹션",
    section: 'job_related',
  },
  {
    question:
      "채용공고에 나온 '고가채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요. 용성 설계' 경험이 있으신가요? 자세히 설명해 주세요.",
    based_on: "채용공고의 '고가용성 설계' 키워드",
    section: 'job_related',
  },
  {
    question:
      "채용공고에 나온 '고가용성채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요.  설계' 경험이 있으신가요? 자세히 설명해 주세요.",
    based_on: "채용공고의 '고가용성 설계' 키워드",
    section: 'job_related',
  },
  {
    question:
      "채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요.",
    based_on: "채용공고의 '고가용성 설계' 키워드",
    section: 'expertise',
  },
  {
    question:
      "채용공고에 나온 '고가용채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요. 성 설계' 경험이 있으신가요? 자세히 설명해 주세요.",
    based_on: "채용공고의 '고가용성 설계' 키워드",
    section: 'expertise',
  },
  {
    question:
      "채용공고에 나온 '고가용채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요. 성 설계' 경험이 있으신가요? 자세히 설명해 주세요.",
    based_on: "채용공고의 '고가용성 설계' 키워드",
    section: 'expertise',
  },
  {
    question:
      "채용공고에 나온 '고가채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요. 용성 설계' 경험이 있으신가요? 자세히 설명해 주세요.",
    based_on: "채용공고의 '고가용성 설계' 키워드",
    section: 'expertise',
  },
  {
    question:
      "채용공고에 나온 '고채용공고에 나온 '고가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요. 가용성 설계' 경험이 있으신가요? 자세히 설명해 주세요.",
    based_on: "채용공고의 '고가용성 설계' 키워드",
    section: 'expertise',
  },
];

const minSelectedQuestionsCount = 3; // 최소 선택해야 하는 질문 개수
const maxSelectedQuestionsCount = 10; // 최대로 선택할수 있는 질문 개수

const SelectPage = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      ['basic', 'experience', 'expertise', 'job_related'].forEach((key) => {
        initial[key] = true;
      });
      return initial;
    },
  );

  const [selectedQuestions, setSelectedQuestions] = useState<ItemType[]>([]);

  const groupedQuestions = useMemo(() => {
    return MOCK_QUESTIONS.reduce<Record<string, ItemType[]>>(
      (acc, question) => {
        if (!acc[question.section]) {
          acc[question.section] = [];
        }

        acc[question.section].push({ ...question, id: uuid() });
        return acc;
      },
      {},
    );
  }, []);

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
    <div className={styles.container}>
      <div className={`${styles.leftContainer}`}>
        <div className={selectStyles.stickyLeftContainer}>
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
                  최소 {minSelectedQuestionsCount - selectedQuestionsCount}개 더
                  선택해야해요
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

          <p>
            AI가 생성한 맞춤형 질문 중에서 연습하고 싶은 질문을 선택해주세요.
            선택한 질문들로 실제 면접과 같은 환경에서 연습할 수 있습니다.
          </p>

          {/* 면접 정보 */}
          <div className={selectStyles.interviewInfoContainer}>
            <p>면접 정보</p>
            <div className={selectStyles.interviewInfoItemContainer}>
              <div className={selectStyles.interviewInfoItem}>
                <span>선택된 질문</span>
                <p>{selectedQuestionsCount}개</p>
              </div>
              <div className={selectStyles.interviewInfoItem}>
                <span>예상 소요시간</span>
                <p>0개</p>
              </div>
              <div className={selectStyles.interviewInfoItem}>
                <span>총 생성된 질문</span>
                <p>{MOCK_QUESTIONS.length}개</p>
              </div>
            </div>
            {/* 버튼 */}
            <div
              className={`${styles.buttonContainer} ${selectStyles.interviewButtonContainer}`}
            >
              <button disabled={isOutOfRange}>
                {isOutOfRange ? '질문을 선택해주세요' : '다음 단계로 넘어가기'}
              </button>
            </div>
          </div>
          {/* 면접 팁 */}
          <div className={selectStyles.interviewTipContainer}>
            <div className={selectStyles.header}>
              <h4>💡 면접 팁</h4>
            </div>
            <ul>
              <li>• 각 질문당 2-3분 정도의 답변을 준비하세요</li>
              <li>• 구체적인 경험과 사례를 포함해 답변하세요</li>
              <li>• 질문의 유형과 근거를 참고해 답변을 준비하세요</li>
            </ul>
          </div>
        </div>
      </div>
      <div
        className={styles.rightContainer}
        style={{ justifyContent: 'flex-start' }}
      >
        {Object.entries(groupedQuestions).map(([section, items]) => {
          const isOpen = openSections[section] ?? true;

          return (
            <div className={selectStyles.listContainer} key={section}>
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
                        questionText={item.question}
                        basedOnText={item.based_on}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectPage;
