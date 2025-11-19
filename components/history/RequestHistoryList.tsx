'use client';

import styles from './styles/i.history.module.css';
import { Loader2 } from 'lucide-react';

import Link from 'next/link';
import { Plus, History } from 'lucide-react';
import {
  RequestListItem,
  RequestStatus,
} from '@/utils/services/generate-request';

interface RequestHistoryListProps {
  data: RequestListItem[];
}

const RequestHistoryList = ({ data }: RequestHistoryListProps) => {
  return (
    <>
      <div className={styles.main}>
        <p className={styles.title}>
          내가 요청했던 질문 생성 내역을 볼 수 있어요
        </p>
        <p className={styles.desc}>
          질문 생성 내역을 확인하고, 내가 생성했던 질문들로 면접을 다시 진행해볼
          수 있어요.
        </p>
        <section className={styles.listContainer}>
          {data.length === 0 ? (
            <EmptyHistory />
          ) : (
            data
              .filter((i) => i.status !== 'working')
              .map((item) => {
                if (item.status === 'completed') {
                  return (
                    <Link
                      key={item.request_id}
                      href={`/new-request/${item.request_id}/select`}
                    >
                      <HistoryItem item={item} />
                    </Link>
                  );
                } else {
                  return <HistoryItem key={item.request_id} item={item} />;
                }
              })
          )}
        </section>
      </div>
    </>
  );
};

const HistoryItem = ({ item }: { item: RequestListItem }) => {
  const isCompleted = item.status === 'completed';
  const hasSessions = item.session_count > 0;

  const createdDate = new Date(item.created_at);

  const statusLabel: Record<RequestStatus, string> = {
    pending: '질문 생성 대기 중',
    working: '질문 생성 중',
    completed: '질문 생성 완료',
    failed: '생성 실패',
  };

  const statusClassName: Record<RequestStatus, string> = {
    pending: styles.statusPending,
    working: styles.statusWorking,
    completed: styles.statusCompleted,
    failed: styles.statusFailed,
  };

  return (
    <div
      className={`${styles.historyItem} ${!isCompleted ? styles.loading : ''}`}
      role="button"
      tabIndex={0}
    >
      <div className={styles.itemHeader}>
        <div className={styles.headerLeft}>
          <h3 className={styles.sessionTitle}>질문 생성{item.request_id}</h3>

          <div className={styles.metaRow}>
            <span className={styles.meta}>
              생성일 {createdDate.toLocaleDateString('ko-KR')}
            </span>
            {isCompleted && (
              <>
                <span className={styles.metaDot} />
                <span className={styles.meta}>
                  {item.questions_count}개 생성됨
                </span>
              </>
            )}
          </div>
        </div>

        <div className={styles.headerRight}>
          <div
            className={`${styles.statusBadge} ${statusClassName[item.status]}`}
          >
            {item.status === 'working' && (
              <Loader2 className={styles.spinner} />
            )}
            <span>{statusLabel[item.status]}</span>
          </div>
        </div>
      </div>
      {hasSessions && (
        <div className={styles.footerRow}>
          <div className={styles.pastSessionTag}>
            <span className={styles.pastSessionDot} />
            <span className={styles.pastSessionText}>
              이 질문들로 모의 면접을 진행한 적 있어요
            </span>
            <span className={styles.pastSessionMeta}>
              총 {item.session_count}회
            </span>
          </div>
        </div>
      )}
    </div>
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

export default RequestHistoryList;
