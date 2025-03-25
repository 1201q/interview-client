import styles from './styles/header.module.css';

const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <p className={styles.logo}>AiTerview</p>
        <div></div>
      </div>
    </div>
  );
};

export default Header;
