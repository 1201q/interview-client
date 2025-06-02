'use client';

import styles from './styles/answer.result.module.css';

import Check from '@/public/check.svg';
import { Feedback } from '@/utils/types/types';

const AnswerTextFeedback = ({ data }: { data: Feedback }) => {
  console.log(data);

  return (
    <div className={styles.container}>
      <div className={styles.questionContainer}>
        <p>답변 피드백</p>
        <div className={styles.answerContainer}>{data.feedback}</div>
      </div>
      <div className={styles.strengthWeaknessContainer}>
        <div className={styles.questionContainer}>
          <p>이런 점은 좋아요</p>
          <div className={styles.feedbackItemContainer}>
            {data.good.map((text, index) => (
              <div
                key={`${text}-${index}`}
                className={styles.answerWithIconContainer}
              >
                <div className={`${styles.icon} ${styles.green}`}>
                  <Check />
                </div>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.questionContainer}>
          <p>개선할 점</p>
          <div className={styles.feedbackItemContainer}>
            {data.bad.map((text, index) => (
              <div
                key={`${text}-${index}`}
                className={styles.answerWithIconContainer}
              >
                <div className={`${styles.icon} ${styles.red}`}>
                  <p>!</p>
                </div>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerTextFeedback;
