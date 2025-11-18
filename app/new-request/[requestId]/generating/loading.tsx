import styles from './loading.module.css';

export default function GeneratingSkeleton() {
  return (
    <div className={styles.main}>
      {/* 컨텐츠 */}
      <div className={styles.contents}>
        <section>
          <div className={styles.sectionTitle}>
            <div
              className={`${styles.skeleton} ${styles.sectionTitleSkeleton} ${styles.shimmer}`}
            ></div>
            <div
              className={`${styles.skeleton} ${styles.sectionDesc} ${styles['w-50']} ${styles.shimmer}`}
            ></div>
          </div>
        </section>
      </div>
    </div>
  );
}
