import QuestionListHeaderClient from './QuestionListHeaderClient';
import styles from './styles/questionListHeader.module.css';
import Plus from '@/public/plus.svg';
import OpenAi from '@/public/openai.svg';

const QuestionListHeaderServer = async () => {
  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <p>질문들</p>
      </div>
      <div className={styles.buttonContainer}>
        <button className={`${styles.button}`}>
          <OpenAi />
          <p>AI로 질문 생성</p>
        </button>
        <button className={`${styles.button}`}>
          <Plus />
          <p>직접추가</p>
        </button>
      </div>
    </div>
  );
};

export default QuestionListHeaderServer;
