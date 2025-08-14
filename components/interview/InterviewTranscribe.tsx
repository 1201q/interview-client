import styles from './styles/interview-transcribe.module.css';

const InterviewTranscribe = () => {
  return (
    <div className={styles.transcribeContainer}>
      <div className={styles.header}>
        <div className={styles.dot}></div>
        <p>음성 인식 중</p>
      </div>
      <div className={styles.list}>
        <div className={`${styles.transcribeItem} ${styles.blue}`}>
          <p>안녕하세요. 저는 컴퓨터공학을 전공한 김철수라고 합니다.</p>
          <span>실시간</span>
        </div>
        <div className={styles.transcribeItem}>
          <p>안녕하세요. 저는 컴퓨터공학을 전공한 김철수라고 합니다.</p>
          <span>00:15</span>
        </div>
        <div className={styles.transcribeItem}>
          <p>안녕하세요. 저는 컴퓨터공학을 전공한 김철수라고 합니다.</p>
          <span>00:15</span>
        </div>
        <div className={styles.transcribeItem}>
          <p>안녕하세요. 저는 컴퓨터공학을 전공한 김철수라고 합니다.</p>
          <span>00:15</span>
        </div>
      </div>
    </div>
  );
};

export default InterviewTranscribe;
