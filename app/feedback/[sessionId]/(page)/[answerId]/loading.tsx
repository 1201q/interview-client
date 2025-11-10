import styles from './loading.module.css';

export default function SkeletonTop() {
  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div
          className={`${styles.skeleton} ${styles.headerSkeleton} ${styles.shimmer}`}
        />
      </div>

      <div className={styles.contents}>
        <div className={`${styles.topQuestionText}`}>
          <div className={`${styles.skeleton} ${styles.shimmer}`}></div>
          <div className={`${styles.tabs}`}>
            <div className={`${styles.tab}`}>
              <div className={`${styles.skeleton} ${styles.shimmer}`}></div>
            </div>
            <div className={`${styles.tab}`}>
              <div className={`${styles.skeleton} ${styles.shimmer}`}></div>
            </div>
            <div className={`${styles.tab}`}>
              <div className={`${styles.skeleton} ${styles.shimmer}`}></div>
            </div>
          </div>
        </div>

        <section>
          <div className={styles.sectionTitle}>
            <div
              className={`${styles.skeleton} ${styles.sectionTitleSkeleton} ${styles.shimmer}`}
            ></div>
          </div>

          <div className={` ${styles.container} ${styles.shimmer}`}>
            <div className={styles.playController}>
              <div className={styles.playButton}>
                <div className={`${styles.skeleton} ${styles.shimmer}`}></div>
              </div>
              <div className={styles.playControllerText}>
                <div className={`${styles.playControllerBigText}`}>
                  <div className={`${styles.skeleton} ${styles.shimmer}`}></div>
                </div>
                <div className={`${styles.playControllerSmallText}`}>
                  <div
                    className={` ${styles.skeleton} ${styles.shimmer}`}
                  ></div>
                </div>
              </div>
            </div>
            <div className={styles.segments}>
              <div className={styles.segment}>
                <div className={`${styles.skeleton} ${styles.shimmer}`}></div>
              </div>
              <div className={styles.segment}>
                <div className={`${styles.skeleton} ${styles.shimmer}`}></div>
              </div>
              <div className={styles.segment}>
                <div className={`${styles.skeleton} ${styles.shimmer}`}></div>
              </div>
              <div className={styles.segment}>
                <div className={`${styles.skeleton} ${styles.shimmer}`}></div>
              </div>
              <div className={styles.segment}>
                <div className={`${styles.skeleton} ${styles.shimmer}`}></div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className={styles.sectionTitle}>
            <div
              className={`${styles.skeleton} ${styles.sectionTitleSkeleton} ${styles.shimmer}`}
            ></div>
          </div>

          <div className={` ${styles.container} ${styles.shimmer}`}></div>
        </section>
      </div>
    </div>
  );
}
