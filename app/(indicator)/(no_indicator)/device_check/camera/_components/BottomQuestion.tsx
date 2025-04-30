import styles from './styles/question.module.css';

const BottomQuestion = () => {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <p>질문 1 / 5</p>
      </div>
      <p className={styles.questionText}>자기소개를 간단히 해주세요.</p>
    </div>
  );
};

export default BottomQuestion;
