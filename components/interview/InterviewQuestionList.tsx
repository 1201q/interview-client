import { useState } from 'react';
import styles from './styles/interview-question.module.css';

const InterviewQuestionList = () => {
  return (
    <div className={styles.questionListContainer}>
      <div className={styles.header}>
        <p>질문 진행 상황</p>
      </div>
      <div className={styles.list}>
        <div className={styles.questionItem}>
          <div className={styles.icon}>1</div>
          <div className={styles.contents}>
            <p>
              이 회사에 지원한 이유는 무엇입니까? 이 회사에 지원한 이유는
              무엇입니까? 이 회사에 지원한 이유는 무엇입니까?
            </p>
          </div>
        </div>
        <div className={styles.questionItem}>
          <div className={styles.icon}>1</div>
          <div className={styles.contents}>
            <p>
              이 회사에 지원한 이유는 무엇입니까? 이 회사에 지원한 이유는
              무엇입니까? 이 회사에 지원한 이유는 무엇입니까?
            </p>
          </div>
        </div>
        <div className={styles.questionItem}>
          <div className={styles.icon}>1</div>
          <div className={styles.contents}>
            <p>
              이 회사에 지원한 이유는 무엇입니까? 이 회사에 지원한 이유는
              무엇입니까? 이 회사에 지원한 이유는 무엇입니까?
            </p>
          </div>
        </div>
        <div className={styles.questionItem}>
          <div className={styles.icon}>1</div>
          <div className={styles.contents}>
            <p>
              이 회사에 지원한 이유는 무엇입니까? 이 회사에 지원한 이유는
              무엇입니까? 이 회사에 지원한 이유는 무엇입니까?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewQuestionList;
