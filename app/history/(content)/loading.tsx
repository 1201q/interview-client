import styles from './loading.module.css';

export default function RequestSkeleton() {
  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div
          className={`${styles.skeleton} ${styles.headerSkeleton} ${styles.shimmer}`}
        />
      </div>
      <div className={styles.contents}>
        <section>
          <div className={styles.sectionTitle}>
            <div
              className={`${styles.skeleton} ${styles.sectionTitleSkeleton} ${styles.shimmer}`}
            ></div>
            <div
              className={`${styles.skeleton} ${styles.sectionDesc} ${styles.shimmer}`}
            ></div>
          </div>

          <div className={` ${styles.container} ${styles.shimmer} `}></div>
        </section>
        <section>
          <div className={` ${styles.container} ${styles.shimmer} `}></div>
        </section>
        <section>
          <div className={` ${styles.container} ${styles.shimmer} `}></div>
        </section>
        <section>
          <div className={` ${styles.container} ${styles.shimmer} `}></div>
        </section>
      </div>
    </div>
  );
}
