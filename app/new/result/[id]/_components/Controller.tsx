'use client';

import { useAtomValue } from 'jotai';
import styles from './styles/controller.module.css';

import Timer from '@/public/clock-regular.svg';
import { userSelectedQuestionsAtom } from '@/store/newSelect';
import { QuestionSection } from '@/utils/types/types';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';

const Controller = () => {
  const selectedQuestions = useAtomValue(userSelectedQuestionsAtom);
  const router = useRouter();
  const param = useParams();
  const id = param.id;

  const timeMap: Record<QuestionSection, number> = {
    basic: 60,
    experience: 120,
    job_related: 90,
    expertise: 90,
  };

  const totalTime = selectedQuestions.reduce(
    (sum, q) => sum + (timeMap[q.section] || 0),
    0,
  );

  const min = Math.round(totalTime / 60);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.container}
    >
      <div className={styles.headerContainer}></div>
      <div className={styles.itemListContainer}>
        <div className={styles.titleContainer}>
          <p>면접 설정</p>
          <span>선택한 질문들로 면접을 진행합니다.</span>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.info}>
            <div className={styles.infoLeft}>
              <Timer />
              <p>선택한 질문</p>
            </div>
            <div className={styles.infoStatus}>
              <p>{selectedQuestions.length}개</p>
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.infoLeft}>
              <Timer />
              <p>예상 소요 시간</p>
            </div>
            <div className={styles.infoStatus}>
              <p>{min}분</p>
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button
            disabled={selectedQuestions.length < 5}
            onClick={() => {
              router.push(`/new/check/${id}`);
            }}
          >
            {selectedQuestions.length < 5
              ? '질문을 5개 이상 선택하세요'
              : '면접 시작'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Controller;
