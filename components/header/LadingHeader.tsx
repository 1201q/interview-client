import styles from './styles/landngHeader.module.css';

const LandingHeader = () => {
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <p className={styles.logo}>AiTerview</p>
        <div></div>
      </div>
    </div>
  );
};

export default LandingHeader;
