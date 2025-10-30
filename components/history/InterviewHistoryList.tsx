'use client';

import styles from './styles/i.history.module.css';
import { AnalysesListDto } from '@/utils/types/analysis';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import Link from 'next/link';
import { Plus, History } from 'lucide-react';

interface InterviewHistoryListProps {
  data: AnalysesListDto[];
}

interface HistoryItemProps {
  item: AnalysesListDto;
}

const InterviewHistoryList = ({ data }: InterviewHistoryListProps) => {
  return (
    <>
      <div className={styles.main}>
        <p className={styles.title}>진행했던 면접 결과들을 볼 수 있어요</p>
        <p className={styles.desc}>
          과거에 진행했던 면접 세션들의 분석 결과를 확인하고, 자신의 성장 과정을
          돌아보세요.
        </p>
        <section className={styles.listContainer}>
          {data.length === 0 ? (
            <EmptyHistory />
          ) : (
            data
              .sort(
                (a, b) =>
                  new Date(b.interview_completed_at).getTime() -
                  new Date(a.interview_completed_at).getTime(),
              )
              .map((item) => <HistoryItem key={item.session_id} item={item} />)
          )}
        </section>
      </div>
    </>
  );
};

const HistoryItem = ({ item }: HistoryItemProps) => {
  const isLoading = !item.analysis_completed;

  const startedAt = useMemo(
    () => new Date(item.interview_started_at),
    [item.interview_started_at],
  );
  const completedAt = useMemo(
    () => new Date(item.interview_completed_at),
    [item.interview_completed_at],
  );

  const durationMin = useMemo(() => {
    if (!startedAt || !completedAt) return null;
    const ms = completedAt.getTime() - startedAt.getTime();
    if (Number.isNaN(ms) || ms < 0) return null;
    return Math.max(1, Math.round(ms / 60000));
  }, [startedAt, completedAt]);

  const questions = item.questions?.text ?? [];

  return (
    <Link href={`/feedback/${item.session_id}`}>
      <div
        className={`${styles.historyItem} ${isLoading ? styles.loading : ''}`}
        role="button"
        tabIndex={0}
      >
        <div className={styles.itemHeader}>
          <div className={styles.headerLeft}>
            <h3 className={styles.sessionTitle}>
              {item.job_role || '면접 세션'}
            </h3>

            <div className={styles.metaRow}>
              <span className={styles.meta}>
                완료일 {completedAt.toLocaleDateString('ko-KR')}
              </span>
              {durationMin && (
                <>
                  <span className={styles.metaDot} />
                  <span className={styles.meta}>{durationMin}분간 진행</span>
                </>
              )}
            </div>
          </div>

          <div className={styles.headerRight}>
            {isLoading && (
              <div className={styles.loadingBadge}>
                <Loader2 className={styles.spinner} />
                <span>분석 중</span>
              </div>
            )}
          </div>
        </div>

        {/* 질문 리스트 */}
        {questions.length > 0 && (
          <ol className={styles.questionList}>
            {questions.map((q, i) => (
              <li key={`${item.session_id}-${i}`} className={styles.qItem}>
                <span className={styles.qIndex}>{i + 1}</span>
                <span className={styles.qText}>{q}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Link>
  );
};

const EmptyHistory = () => {
  return (
    <div className={styles.emptyBlock}>
      <div className={styles.emptyIconWrap}>
        <History className={styles.emptyIcon} />
      </div>
      <h3 className={styles.emptyTitle}>아직 기록이 없어요</h3>
      <p className={styles.emptyDesc}>
        이력서와 채용공고를 기반으로 맞춤형 질문을 생성하고, 모의 면접을 시작해
        보세요.
      </p>
      <div className={styles.emptyRow}>
        <Link href={'/new-request'}>
          <button className={styles.primaryButton}>
            <Plus size={16} />
            <span>새 면접 시작하기</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default InterviewHistoryList;
