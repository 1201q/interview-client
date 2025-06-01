'use client';

import { ReactNode } from 'react';
import styles from './styles/answer.result.module.css';
import { useAtomValue } from 'jotai';
import { selectedAnswerAtom } from '@/store/result';
import Button from '@/components/common/Button';
import Play from '@/public/play.svg';

import Check from '@/public/check.svg';

const AnswerTextFeedback = () => {
  const selected = useAtomValue(selectedAnswerAtom);

  return (
    <div className={styles.container}>
      <div className={styles.questionContainer}>
        <p>답변 피드백</p>
        <div className={styles.answerContainer}>
          강점과 약점을 균형 있게 제시했으며, 약점에 대한 개선 노력을 언급한
          점이 좋았습니다. 답변이 구체적이고 진솔했습니다. 다만, 강점을 뒷받침할
          수 있는 구체적인 사례를 더 추가하면 설득력이 높아질 것입니다.
        </div>
      </div>
      <div className={styles.strengthWeaknessContainer}>
        <div className={styles.questionContainer}>
          <p>이런 점은 좋아요</p>
          <div className={styles.feedbackItemContainer}>
            <div className={styles.answerWithIconContainer}>
              <div className={`${styles.icon} ${styles.green}`}>
                <Check />
              </div>
              <p>기본적인 인사와 주문 표현을 정확하게 사용했습니다.</p>
            </div>
            <div className={styles.answerWithIconContainer}>
              <div className={`${styles.icon} ${styles.green}`}>
                <Check />
              </div>
              <p>기본적인 인사와 주문 표현을 정확하게 사용했습니다.</p>
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
    </div>
  );
};

export default AnswerTextFeedback;
