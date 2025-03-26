import Header from '../header/Header';
import Info from './Info';
import styles from './styles/landing.module.css';

const Landing = () => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.topContainer}>
        <div className={styles.welcomeTextContainer}>
          <p className={styles.welcomeText}>AI와 함께하는</p>
          <p className={`${styles.welcomeText} ${styles.highlight}`}>
            자신감 있는 취업 준비
          </p>
        </div>
        <div className={styles.explainTextContainer}>
          <p className={styles.explainText}>
            AI와 함께 모의 면접을 대비해보세요. 부족한 부분을 체크해보고,
            피드백을 받을 수 있어요.
          </p>
          <p className={styles.explainText}>합격까지 같이 달려요!</p>
        </div>
        <div className={styles.buttonContainer}>
          <button>바로 시작</button>
        </div>
      </div>
      <Info />
    </div>
  );
};

export default Landing;
