import styles from '../_styles/loading.module.css';

const Loading = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Loading;
