'use client';

import styles from './styles/i.status.module.css';

export default function InterviewSidebarStatus({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const progress = (current / total) * 100;

  return (
    <div className={styles.wrap}>
      {/* 오른쪽: 텍스트 영역 */}
      <div className={styles.inner}>
        <div className={styles.top}>
          <span className={styles.title}>완료된 질문</span>
        </div>

        <div className={styles.center}>
          <span className={styles.qCount}>
            <strong>Q{current}</strong> / {total}
          </span>
        </div>

        {/* 하단 진행 바 */}
        <div className={styles.bar}>
          <div
            className={styles.barFill}
            style={{ transform: `translateX(${progress}%)` }}
          />
        </div>
      </div>
    </div>
  );
}
