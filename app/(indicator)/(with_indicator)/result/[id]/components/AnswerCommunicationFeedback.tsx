'use client';

import { ReactNode } from 'react';
import styles from './styles/answer.result.module.css';
import { useAtomValue } from 'jotai';
import { selectedAnswerAtom } from '@/store/result';

const AnswerCommunicationFeedback = () => {
  const selected = useAtomValue(selectedAnswerAtom);

  return (
    <div className={styles.container}>
      <div className={styles.questionContainer}>
        <p>음성</p>
        <div className={styles.resultItemContainer}>
          <div className={styles.resultItem}>
            <span>답변 시간</span>
            <p>3초</p>
          </div>
          <div className={styles.resultItem}>
            <span>말 속도</span> <p>적당함</p>
          </div>
          <div className={styles.resultItem}>
            <span>목소리 크기</span> <p>적당함</p>
          </div>
          <div className={styles.resultItem}>
            <span>억양</span> <p>자연스러움</p>
          </div>
          <div className={styles.resultItem}>
            <span>침묵 시간</span> <p>5초</p>
          </div>
        </div>
      </div>
      <div className={styles.questionContainer}>
        <p>시각</p>
        <div className={styles.resultItemContainer}>
          <div className={styles.resultItem}>
            <span>시선 집중도</span>
            <p>75%</p>
          </div>
          <div className={styles.resultItem}>
            <span>고개 움직임</span> <p>적당함</p>
          </div>

          <div className={styles.resultItem}>
            <span>얼굴 이탈 시간</span> <p>0초</p>
          </div>
        </div>
      </div>
      <div className={styles.questionContainer}>
        <p>개선할 점</p>
        <div className={styles.feedbackItemContainer}>
          <div className={styles.answerWithIconContainer}>
            <div className={`${styles.icon} ${styles.red}`}>
              <p>!</p>
            </div>
            <p>
              주세요 대신 더 공손한 표현인 주시겠어요?를 사용해볼 수 있습니다.
            </p>
          </div>
          <div className={styles.answerWithIconContainer}>
            <div className={`${styles.icon} ${styles.red}`}>
              <p>!</p>
            </div>
            <p>기본적인 인사와 주문 표현을 정확하게 사용했습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerCommunicationFeedback;
