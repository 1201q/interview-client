import { AnimatePresence, motion, Variants } from 'motion/react';
import styles from './styles/select-guide.module.css';
import Button from '@/components/shared/Button';
import { useAtomValue } from 'jotai';
import {
  selectedQuestionsCountAtom,
  selectedTotalSecondsAtom,
} from '@/store/selectedQuestions';
import {
  maxSelectedQuestionsCount,
  minSelectedQuestionsCount,
} from '@/utils/constants/common';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SelectGuideProps {
  itemVariants: Variants;
  questionLength: number;
}

const formatting = (sec: number) => {
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;

  if (seconds === 0) {
    return `${minutes}분`;
  }

  return `${minutes}분 ${seconds}초`;
};

const SelectGuide = ({ itemVariants, questionLength }: SelectGuideProps) => {
  const selectedQuestionsCount = useAtomValue(selectedQuestionsCountAtom);
  const totalSec = useAtomValue(selectedTotalSecondsAtom);

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const isOutOfRange =
    selectedQuestionsCount < minSelectedQuestionsCount ||
    selectedQuestionsCount > maxSelectedQuestionsCount;

  return (
    <div className={styles.stickyContainer}>
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
                {maxSelectedQuestionsCount - selectedQuestionsCount}개 더 선택할
                수 있어요
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
        AI가 생성한 맞춤형 질문 중에서 연습하고 싶은 질문을 선택해주세요. 선택한
        질문들로 실제 면접과 같은 환경에서 연습할 수 있습니다.
      </motion.p>

      {/* 면접 정보 */}
      <motion.div
        variants={itemVariants}
        className={styles.interviewInfoContainer}
        style={{ margin: '10px 0' }}
      >
        <p>면접 정보</p>
        <div className={styles.interviewInfoItemContainer}>
          <div className={styles.interviewInfoItem}>
            <span>선택된 질문</span>
            <p>{selectedQuestionsCount}개</p>
          </div>
          <div className={styles.interviewInfoItem}>
            <span>예상 소요시간</span>
            <p>{formatting(totalSec)}</p>
          </div>
          <div className={styles.interviewInfoItem}>
            <span>총 생성된 질문</span>
            <p>{questionLength}개</p>
          </div>
        </div>
        {/* 버튼 */}
        <Button
          isSmallButton={true}
          disabled={isOutOfRange}
          text={isOutOfRange ? '질문을 선택해주세요' : '다음 단계로 넘어가기'}
          loading={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
            }, 2000);
          }}
        />
      </motion.div>
      {/* 면접 팁 */}
      <motion.div variants={itemVariants} className={styles.tipContainer}>
        <div className={styles.header}>
          <h4>💡 면접 팁</h4>
        </div>
        <ul>
          <li>• 각 질문당 2-3분 정도의 답변을 준비하세요</li>
          <li>• 구체적인 경험과 사례를 포함해 답변하세요</li>
          <li>• 질문의 유형과 근거를 참고해 답변을 준비하세요</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default SelectGuide;
