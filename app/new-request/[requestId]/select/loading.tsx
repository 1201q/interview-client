'use client';

import styles from './loading.module.css';

export default function SelectSkeleton() {
  return (
    <div className={styles.main}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div
          className={`${styles.skeleton} ${styles.headerSkeleton} ${styles.shimmer}`}
        />
      </div>

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

        <section>
          <div className={styles.sectionTitle}>
            <div
              className={`${styles.skeleton} ${styles.sectionDesc} ${styles['w-20']} ${styles.shimmer}`}
            ></div>
          </div>
          <div className={styles.questionList}>
            <div className={`${styles.question} ${styles.shimmer}`}>
              <div className={styles.questionOrder}>
                <div className={`${styles.skeleton}  ${styles.shimmer}`}></div>
              </div>
              <div className={styles.questionText}>
                <div className={styles.questionTitle}>
                  <div
                    className={`${styles.skeleton} ${styles.questionTitle} ${styles['w-80']} ${styles.shimmer}`}
                  ></div>
                </div>
                <div className={styles.questionBasedon}>
                  <div
                    className={`${styles.skeleton} ${styles.questionBasedon} ${styles['w-30']} ${styles.shimmer}`}
                  ></div>
                </div>
              </div>
            </div>
            <div className={`${styles.question} ${styles.shimmer}`}>
              <div className={styles.questionOrder}>
                <div className={`${styles.skeleton}  ${styles.shimmer}`}></div>
              </div>
              <div className={styles.questionText}>
                <div className={styles.questionTitle}>
                  <div
                    className={`${styles.skeleton} ${styles.questionTitle} ${styles['w-80']} ${styles.shimmer}`}
                  ></div>
                </div>
                <div className={styles.questionBasedon}>
                  <div
                    className={`${styles.skeleton} ${styles.questionBasedon} ${styles['w-30']} ${styles.shimmer}`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className={styles.sectionTitle}>
            <div
              className={`${styles.skeleton} ${styles.sectionDesc} ${styles['w-20']} ${styles.shimmer}`}
            ></div>
          </div>
          <div className={styles.questionList}>
            <div className={`${styles.question} ${styles.shimmer}`}>
              <div className={styles.questionOrder}>
                <div className={`${styles.skeleton}  ${styles.shimmer}`}></div>
              </div>
              <div className={styles.questionText}>
                <div className={styles.questionTitle}>
                  <div
                    className={`${styles.skeleton} ${styles.questionTitle} ${styles['w-80']} ${styles.shimmer}`}
                  ></div>
                </div>
                <div className={styles.questionBasedon}>
                  <div
                    className={`${styles.skeleton} ${styles.questionBasedon} ${styles['w-30']} ${styles.shimmer}`}
                  ></div>
                </div>
              </div>
            </div>{' '}
            <div className={`${styles.question} ${styles.shimmer}`}>
              <div className={styles.questionOrder}>
                <div className={`${styles.skeleton}  ${styles.shimmer}`}></div>
              </div>
              <div className={styles.questionText}>
                <div className={styles.questionTitle}>
                  <div
                    className={`${styles.skeleton} ${styles.questionTitle} ${styles['w-80']} ${styles.shimmer}`}
                  ></div>
                </div>
                <div className={styles.questionBasedon}>
                  <div
                    className={`${styles.skeleton} ${styles.questionBasedon} ${styles['w-30']} ${styles.shimmer}`}
                  ></div>
                </div>
              </div>
            </div>
            <div className={`${styles.question} ${styles.shimmer}`}>
              <div className={styles.questionOrder}>
                <div className={`${styles.skeleton}  ${styles.shimmer}`}></div>
              </div>
              <div className={styles.questionText}>
                <div className={styles.questionTitle}>
                  <div
                    className={`${styles.skeleton} ${styles.questionTitle} ${styles['w-80']} ${styles.shimmer}`}
                  ></div>
                </div>
                <div className={styles.questionBasedon}>
                  <div
                    className={`${styles.skeleton} ${styles.questionBasedon} ${styles['w-30']} ${styles.shimmer}`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className={styles.sectionTitle}>
            <div
              className={`${styles.skeleton} ${styles.sectionDesc} ${styles['w-20']} ${styles.shimmer}`}
            ></div>
          </div>
          <div className={styles.questionList}>
            <div className={`${styles.question} ${styles.shimmer}`}>
              <div className={styles.questionOrder}>
                <div className={`${styles.skeleton}  ${styles.shimmer}`}></div>
              </div>
              <div className={styles.questionText}>
                <div className={styles.questionTitle}>
                  <div
                    className={`${styles.skeleton} ${styles.questionTitle} ${styles['w-80']} ${styles.shimmer}`}
                  ></div>
                </div>
                <div className={styles.questionBasedon}>
                  <div
                    className={`${styles.skeleton} ${styles.questionBasedon} ${styles['w-30']} ${styles.shimmer}`}
                  ></div>
                </div>
              </div>
            </div>
            <div className={`${styles.question} ${styles.shimmer}`}>
              <div className={styles.questionOrder}>
                <div className={`${styles.skeleton}  ${styles.shimmer}`}></div>
              </div>
              <div className={styles.questionText}>
                <div className={styles.questionTitle}>
                  <div
                    className={`${styles.skeleton} ${styles.questionTitle} ${styles['w-80']} ${styles.shimmer}`}
                  ></div>
                </div>
                <div className={styles.questionBasedon}>
                  <div
                    className={`${styles.skeleton} ${styles.questionBasedon} ${styles['w-30']} ${styles.shimmer}`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
