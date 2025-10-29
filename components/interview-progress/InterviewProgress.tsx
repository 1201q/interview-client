'use client';

import { useState } from 'react';
import { useInterview } from './InterviewProvider';
import styles from './styles/i.progress.module.css';
import { useStableSSE } from '@/utils/hooks/useStableSSE';
import { AnalysisEvent, AnalysisStage } from '@/utils/types/analysis-sse';

type StageProgress = Partial<Record<AnalysisStage, number>>;
type MapProgress = Record<string, StageProgress>;

const WEIGHTS: Record<Exclude<AnalysisStage, 'overall'>, number> = {
  stt: 25,
  refine: 25,
  audio: 25,
  feedback: 25,
};

function mergeProgress(
  cur: StageProgress,
  stage: AnalysisStage,
  value: number,
) {
  const prev = cur[stage] ?? 0;
  return { ...cur, [stage]: Math.max(prev, value) };
}

function computeOverall(p: StageProgress): number {
  let sum = 0;
  (Object.keys(WEIGHTS) as Array<keyof typeof WEIGHTS>).forEach((k) => {
    const v = p[k as AnalysisStage] ?? 0;
    sum += (v / 100) * WEIGHTS[k];
  });
  return Math.max(0, Math.min(100, Math.round(sum)));
}

const InterviewProgress = (props: ReturnType<typeof useInterview>) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/analysis/sse/${props.sessionId}`;

  const [byAnswer, setByAnswer] = useState<MapProgress>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useStableSSE<AnalysisEvent>(url, {
    onOpen: () => {
      console.log('SSE connection opened');
    },
    onNamed: {
      progress: (data) => {
        const { answer_id, stage, value } = data;

        setByAnswer((prev) => {
          const cur = prev[answer_id] ?? {};
          return { ...prev, [answer_id]: mergeProgress(cur, stage, value) };
        });
      },

      completed: (data) => {
        const { answer_id } = data;
        setByAnswer((prev) => {
          const cur = prev[answer_id] ?? {};

          const next: StageProgress = { ...cur, overall: 100 };

          return { ...prev, [answer_id]: next };
        });
      },

      failed: (data) => {
        const { answer_id, reason } = data;
        setErrors((prev) => ({ ...prev, [answer_id]: reason ?? '분석 실패' }));
      },
    },

    onError: (error) => {
      console.warn('SSE error:', error);
    },
  });

  return (
    <div className={styles.bg}>
      <div className={styles.modal}>
        {props.clientQuestions.map((q) => {
          const p = byAnswer[q.answer_id] ?? {};
          const error = errors[q.answer_id];

          return (
            <div key={q.answer_id} className={styles.item}>
              <div className={styles.header}>
                <span className={styles.order}>Q{q.order + 1}.</span>
              </div>
              {Bars(p)}
              {error ? <p className={styles.error}>{error}</p> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Bars = (p: StageProgress) => {
  const stt = Math.round(p.stt ?? 0);
  const refine = Math.round(p.refine ?? 0);
  const audio = Math.round(p.audio ?? 0);
  const feedback = Math.round(p.feedback ?? 0);
  const overall = Number.isFinite(p.overall)
    ? Math.round(p.overall!)
    : computeOverall(p);

  return (
    <div className={styles.bars}>
      <div className={styles.barGroup}>
        <span className={styles.barLabel}>STT</span>
        <div className={styles.bar}>
          <div className={styles.fill} style={{ width: `${stt}%` }} />
        </div>
        <span className={styles.percent}>{stt}%</span>
      </div>

      <div className={styles.barGroup}>
        <span className={styles.barLabel}>Refine</span>
        <div className={styles.bar}>
          <div className={styles.fill} style={{ width: `${refine}%` }} />
        </div>
        <span className={styles.percent}>{refine}%</span>
      </div>

      <div className={styles.barGroup}>
        <span className={styles.barLabel}>Audio</span>
        <div className={styles.bar}>
          <div className={styles.fill} style={{ width: `${audio}%` }} />
        </div>
        <span className={styles.percent}>{audio}%</span>
      </div>

      <div className={styles.barGroup}>
        <span className={styles.barLabel}>Feedback</span>
        <div className={styles.bar}>
          <div className={styles.fill} style={{ width: `${feedback}%` }} />
        </div>
        <span className={styles.percent}>{feedback}%</span>
      </div>

      <div className={`${styles.barGroup} ${styles.overall}`}>
        <span className={styles.barLabel}>Overall</span>
        <div className={styles.bar}>
          <div className={styles.fill} style={{ width: `${overall}%` }} />
        </div>
        <span className={styles.percent}>{overall}%</span>
      </div>
    </div>
  );
};

export default InterviewProgress;
