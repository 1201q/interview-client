import styles from './styles/new.header.module.css';
import Logo from '@/public/openai.svg';

const NewHeader = () => {
  return (
    <header className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.box}>
          <div className={styles.logo}>
            <Logo /> <p>DevInterview AI</p>
          </div>
        </div>
        <div className={styles.box}>
          <button className={styles.menuButton}>AI 면접</button>
          <button className={styles.menuButton}>로그인</button>
        </div>
      </div>
    </header>
  );
};

export default NewHeader;
