import styles from './loading.module.css';

const ListLoader = () => {
  return (
    <div className={styles.container}>
      {Array.from({ length: 12 }, (_, index) => (
        <div key={index} className={styles.loading}></div>
      ))}
    </div>
  );
};

export default ListLoader;
