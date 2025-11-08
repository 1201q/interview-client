'use client';

import styles from './styles/i.completed.module.css';
import { motion } from 'motion/react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { AnalysesStatusesItem } from '@/utils/types/analysis';
import { AnalysisEvent, AnalysisStage } from '@/utils/types/analysis-sse';
import { useEffect, useMemo, useState } from 'react';
import { useStableSSE } from '@/utils/hooks/useStableSSE';
import { useRouter } from 'next/navigation';

type StageProgress = Partial<Record<AnalysisStage, number>>;

type AnswerProgressState = {
  // 스냅샷에서 초기화 (analysis_progress.overall)
  baseOverall: number;
  // SSE로 누적 업데이트 (0~100)
  stages: StageProgress; // { stt, refine, audio, feedback }
  // 표시용 최종 overall
  overall: number;
};

type ProgressMap = Record<string /* answer_id */, AnswerProgressState>;

const WEIGHTS: Record<Exclude<AnalysisStage, 'overall'>, number> = {
  stt: 25,
  refine: 25,
  audio: 25,
  feedback: 25,
};

function computeWeighted(stages: StageProgress): number {
  const stt = stages.stt ?? 0;
  const refine = stages.refine ?? 0;
  const audio = stages.audio ?? 0;
  const feedback = stages.feedback ?? 0;
  const w =
    (stt / 100) * WEIGHTS.stt +
    (refine / 100) * WEIGHTS.refine +
    (audio / 100) * WEIGHTS.audio +
    (feedback / 100) * WEIGHTS.feedback;
  return Math.round(Math.max(0, Math.min(100, w)));
}

function computeOverall(baseOverall: number, stages: StageProgress): number {
  const weighted = computeWeighted(stages);
  return Math.max(baseOverall ?? 0, weighted);
}

// 스냅샷 → 클라이언트 상태로 변환
const getProgressMap = (statuses: AnalysesStatusesItem[]): ProgressMap => {
  const map: ProgressMap = {};

  for (const s of statuses) {
    const ap: any = s.analysis_progress ?? {};
    const baseOverall = typeof ap.overall === 'number' ? ap.overall : 0;

    const stages: StageProgress = {
      stt: ap.stt ? 100 : 0,
      refine: ap.refine ? 100 : 0,
      audio: ap.audio ? 100 : 0,
      feedback: ap.feedback ? 100 : 0,
    };

    const overall = computeOverall(baseOverall, stages);

    map[s.answer_id] = {
      baseOverall,
      stages,
      overall,
    };
  }

  return map;
};

// SSE 이벤트 병합
const applyProgressEvent = (
  prev: ProgressMap,
  ev: { answer_id: string; stage: AnalysisStage; value: number },
): ProgressMap => {
  const cur =
    prev[ev.answer_id] ??
    ({ baseOverall: 0, stages: {}, overall: 0 } as AnswerProgressState);

  const nextStages: StageProgress = {
    ...cur.stages,
    [ev.stage]: Math.max(cur.stages[ev.stage] ?? 0, ev.value),
  };
  const nextOverall = computeOverall(cur.baseOverall, nextStages);

  return {
    ...prev,
    [ev.answer_id]: {
      ...cur,
      stages: nextStages,
      overall: nextOverall,
    },
  };
};

// 세션 전체 퍼센트(모든 answer overall 평균)
const computeSessionOverall = (m: ProgressMap) => {
  const values = Object.values(m);
  if (!values.length) return 0;
  const avg =
    values.reduce((acc, x) => acc + (x.overall ?? 0), 0) / values.length;
  return Math.round(avg);
};

const InterviewAnalyzingOverlay = ({
  sessionId,
  statuses,
}: {
  sessionId: string;
  statuses: AnalysesStatusesItem[];
}) => {
  const router = useRouter();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/analysis/sse/${sessionId}`;

  const [progressMap, setProgressMap] = useState<ProgressMap>(
    getProgressMap(statuses),
  );

  // 세션 전체 퍼센트
  const sessionOverall = useMemo(
    () => computeSessionOverall(progressMap),
    [progressMap],
  );

  const allDone = sessionOverall === 100;

  useStableSSE<AnalysisEvent>(url, {
    onNamed: {
      progress: (ev) => {
        setProgressMap((prev) =>
          applyProgressEvent(prev, {
            answer_id: ev.answer_id,
            stage: ev.stage, // 'stt' | 'refine' | 'audio' | 'feedback'
            value: ev.value, // 0~100
          }),
        );
      },
      completed: (ev) => {
        setProgressMap((prev) => {
          const cur = prev[ev.answer_id];
          if (!cur) return prev;
          return {
            ...prev,
            [ev.answer_id]: {
              ...cur,
              overall: 100,
              stages: {
                ...cur.stages,
                stt: 100,
                refine: 100,
                audio: 100,
                feedback: 100,
                overall: 100,
              },
            },
          };
        });
      },
    },
  });

  useEffect(() => {
    if (allDone) {
      const t = setTimeout(() => router.refresh(), 1200);
      return () => clearTimeout(t);
    }
  }, [allDone, router, sessionId]);

  return (
    <div className={styles.main}>
      <motion.div
        className={styles.contents}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          면접이 종료되었습니다
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          결과를 열심히 분석 중입니다
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.6,
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className={styles.progress}
        >
          <span>{sessionOverall}%</span>

          <motion.div
            className={styles.loader}
            animate={allDone ? { scale: 1 } : { rotate: 360 }}
            transition={
              allDone
                ? { type: 'spring', stiffness: 240, damping: 18 }
                : { duration: 1, repeat: Infinity, ease: 'linear' }
            }
          >
            {allDone ? <CheckCircle2 size={30} /> : <Loader2 size={30} />}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default InterviewAnalyzingOverlay;
