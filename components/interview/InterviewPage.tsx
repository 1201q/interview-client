import WebcamInstance from '../refactorWebcam/WebcamInstance';
import InterviewFaceCamera from './InterviewFaceCamera';
import styles from './styles/interview.module.css';

const InterviewPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <div className={styles.leftHeaderContainer}></div>
        <div className={styles.leftMainContainer}>
          <section>
            <InterviewFaceCamera />
          </section>
        </div>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.transcribeContainer}>
          <section>1</section>
        </div>
        <div className={styles.questionListContainer}>
          <section>1</section>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
