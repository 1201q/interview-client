'use client';

import AiQuestionHeader from '@/components/select/listHeader/AiQuestionHeader';
import styles from './page.module.css';

const Page = () => {
  return (
    <>
      <AiQuestionHeader />
      <div className={styles.section}>
        <div className={styles.titleTextContainer}>
          <p className={styles.titleText}>직무 분야</p>
          <p className={styles.requiredText}>*</p>
        </div>
        <p className={styles.explainText}>
          어떤 포지션 기반의 질문을 원하시는지 알려주세요.
        </p>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="프론트엔드, 백엔드, IOS, 머신러닝 등..."
          />
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.titleTextContainer}>
          <p className={styles.titleText}>질문 유형</p>
          <p className={styles.requiredText}>*</p>
        </div>
        <p className={styles.explainText}>
          어떤 형식의 질문을 원하시는지 알려주세요. (복수선택 가능)
        </p>
        <div className={styles.optionTypeContainer}>
          <button className={styles.optionType}>
            <div className={styles.optionLogo}>
              <p>📘</p>
            </div>
            <p>개념 설명형</p>
          </button>

          <button className={styles.optionType}>
            <div className={styles.optionLogo}>
              <p>🛠️</p>
            </div>
            <p>구현 문제형</p>
          </button>

          <button className={styles.optionType}>
            <div className={styles.optionLogo}>
              <p>⚖️</p>
            </div>
            <p>비교 설명형</p>
          </button>

          <button className={styles.optionType}>
            <div className={styles.optionLogo}>
              <p>📦</p>
            </div>
            <p>시스템 설계형</p>
          </button>

          <button className={styles.optionType}>
            <div className={styles.optionLogo}>
              <p>📍</p>
            </div>
            <p>상황/경험형</p>
          </button>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.titleTextContainer}>
          <p className={styles.titleText}>질문 주제 설명</p>
          <p className={styles.requiredText}>*</p>
        </div>
        <p className={styles.explainText}>
          질문 받고 싶은 주제를 설명해주세요. 키워드를 중심으로 입력하면 좋아요.
        </p>
        <div className={styles.textareaContainer}>
          <textarea placeholder="질문 받고 싶은 세부 스택이나, 기술, 전공 개념도 좋아요." />
        </div>
      </div>
    </>
  );
};

export default Page;
