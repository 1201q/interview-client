import styles from './styles/select.info.module.css';

const SelectInfo = () => {
  return (
    <div className={`${styles.container}`}>
      <p className={styles.titleText}>질문개수</p>
      <p className={styles.selectCountText}>0</p>
      <span className={styles.divider}>/</span>
      <p className={styles.limitCountText}>10</p>
    </div>
  );
};

export default SelectInfo;
