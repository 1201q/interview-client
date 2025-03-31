import QuestionListHeaderClient from './QuestionListHeaderClient';
import styles from './styles/questionListHeader.module.css';
import OpenAi from '@/public/openai.svg';
import Link from 'next/link';

const QuestionListHeaderServer = async () => {
  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <p>질문들</p>
      </div>
      <div className={styles.buttonContainer}>
        <Link href={'/step/select/ai'}>
          <button className={`${styles.button}`}>
            <OpenAi />
            <p>AI로 질문 생성</p>
          </button>
        </Link>
        <QuestionListHeaderClient />
      </div>
    </div>
  );
};

export default QuestionListHeaderServer;
