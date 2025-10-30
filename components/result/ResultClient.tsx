'use client';

import {
  AnalysisItem,
  RubricItemDto,
  SegmentDto,
  VoicePublic,
} from '@/utils/types/analysis';
import styles from './styles/r.client.module.css';

import {
  Play,
  QuoteIcon,
  ClipboardCheckIcon,
  InfoIcon,
  SearchCheckIcon,
  SearchXIcon,
  SmileIcon,
  ActivityIcon,
  ClockIcon,
  MicIcon,
  VolumeXIcon,
  PauseIcon,
  Pause,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  PieChart,
  Pie,
  Cell,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  ReferenceLine,
  Scatter,
} from 'recharts';

interface ResultClientProps {
  data: AnalysisItem;
  answerId: string;
}

const ResultClient = ({ data, answerId }: ResultClientProps) => {
  const [selectedTab, setSelectedTab] =
    useState<keyof RubricItemDto>('context');

  const tabs: Array<{
    key: keyof RubricItemDto;
    label: string;
    text: string | null;
  }> = [
    { key: 'context', label: '질문 생성 근거', text: data.rubric.context },
    { key: 'intent', label: '면접관 의도', text: data.rubric.intent },
    { key: 'required', label: '핵심 평가 요소', text: data.rubric.required },
    { key: 'optional', label: '보너스 평가 요소', text: data.rubric.optional },
  ];

  const hasMisconception = data.feedback?.misconception;

  //
  // ===== 오디오  =====
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const [audioReady, setAudioReady] = useState(false);

  const toSeconds = (v: number) => (v > 1000 ? v / 1000 : v);

  const segments = useMemo(() => {
    return (data.answer?.segments ?? []).map((s: SegmentDto) => ({
      ...s,
      startSec: toSeconds(s.start),
      endSec: toSeconds(s.end),
      display: s.refined_text ?? s.text,
    }));
  }, [data.answer?.segments]);

  const locateIndex = useCallback(
    (t: number) => {
      if (!segments.length) return null;

      const i = segments.findIndex((s) => t >= s.startSec && t < s.endSec);
      return i >= 0 ? i : null;
    },
    [segments],
  );

  const ensureAudio = useCallback(async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'none'; // 재생 시점에 로드
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentIdx(null);
      });
      audioRef.current.addEventListener('timeupdate', () => {
        const t = audioRef.current?.currentTime ?? 0;
        setCurrentTime(t);
      });
      audioRef.current.addEventListener('play', () => setIsPlaying(true));
      audioRef.current.addEventListener('pause', () => setIsPlaying(false));
      audioRef.current.addEventListener('loadedmetadata', () =>
        setAudioReady(true),
      );
    }

    // src 세팅(302로 presigned 이동)
    if (audioRef.current && !audioRef.current.src) {
      if (!answerId) return;
      audioRef.current.src = `${process.env.NEXT_PUBLIC_API_URL}/analysis/${answerId}/par`;
    }
  }, [data, answerId]);

  // 재생/일시정지
  const togglePlay = useCallback(async () => {
    await ensureAudio();
    const el = audioRef.current!;
    if (el.paused) {
      await el.play().catch(() => {
        /* 자동재생 제한 대비 */
      });
    } else {
      el.pause();
    }
  }, [ensureAudio]);

  // 문장 클릭 → 해당 세그먼트로 점프 후 재생
  const handleSentenceClick = useCallback(
    async (idx: number) => {
      await ensureAudio();
      const el = audioRef.current!;
      const s = segments[idx];
      if (!s) return;
      el.currentTime = s.startSec + 0.01; // 경계 클릭시 보정
      if (el.paused) {
        await el.play().catch(() => {});
      }
    },
    [ensureAudio, segments],
  );

  // currentTime 변동 시 현재 인덱스 계산 (requestAnimationFrame 수준으로 충분)
  useEffect(() => {
    const idx = locateIndex(currentTime);
    setCurrentIdx(idx);
  }, [currentTime, locateIndex]);

  // 재생 위치 표기용 mm:ss
  const mmss = useMemo(() => {
    const m = Math.floor(currentTime / 60);
    const s = Math.floor(currentTime % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, [currentTime]);

  return (
    <div className={styles.main}>
      {/* 상단 정보 */}
      <section className={styles.column}>
        <div className={`${styles.sectionTitle}`}>
          <InfoIcon
            className={styles.defaultText}
            style={{ marginTop: '2px' }}
          />
          <h3 className={styles.defaultText}>질문 정보</h3>
        </div>
        <div className={styles.container}>
          <div className={`${styles.question}`}>
            <h1>
              <span className={styles.orderText}>{data.order + 1}.</span>
              <span className={styles.questionText}>{data.question_text}</span>
            </h1>
          </div>
          <ul className={styles.tabs}>
            {tabs.map((tab) => (
              <li
                className={`${styles.tab} ${selectedTab === tab.key ? styles.selected : ''}`}
                key={tab.key}
                onClick={() => {
                  setSelectedTab(tab.key);
                }}
              >
                {tab.label}
              </li>
            ))}
          </ul>
          <div className={styles.questionInfo}>
            <p className={styles.title}>
              {tabs.find((t) => t.key === selectedTab)?.label}
            </p>
            <p className={styles.desc}>
              {tabs.find((t) => t.key === selectedTab)?.text ||
                '정보가 없습니다.'}
            </p>
          </div>
        </div>
      </section>
      {/* 나의 답변 */}
      <section className={styles.column}>
        <div className={`${styles.sectionTitle}`}>
          <QuoteIcon
            className={`${styles.blueText}`}
            style={{ marginTop: '2px' }}
          />
          <h3 className={`${styles.blueText}`}>나의 답변</h3>
        </div>
        <div className={styles.container}>
          <div className={styles.playController}>
            <button className={styles.playButton} onClick={togglePlay}>
              {isPlaying ? (
                <PauseIcon size={20} color="white" style={{ marginTop: 3 }} />
              ) : (
                <Play size={20} color="white" style={{ marginTop: 3 }} />
              )}
            </button>
            <div className={styles.playControllerRightInfo}>
              <p className={styles.title}>{mmss}</p>
              <p className={styles.desc}>
                문장을 클릭하면 해당 위치부터 재생됩니다
                {!audioReady ? ' (오디오 준비 중…)' : ''}
              </p>
            </div>
          </div>
          <p className={styles.segments}>
            {data.answer.segments.map((s, index) => {
              const isActive = currentIdx === index && isPlaying;
              const cls = isPlaying
                ? isActive
                  ? styles.segActive
                  : styles.segDim
                : styles.segIdle;

              return (
                <span
                  key={s.id}
                  className={cls}
                  onClick={() => handleSentenceClick(index)}
                >
                  {s.refined_text}
                </span>
              );
            })}
          </p>
        </div>
      </section>
      {/* 피드백 */}
      <section className={styles.column}>
        <div className={`${styles.sectionTitle}`}>
          <ClipboardCheckIcon
            style={{ marginTop: '1px' }}
            className={`${styles.greenText}`}
          />
          <h3 className={`${styles.greenText}`}>면접관 피드백</h3>
        </div>
        <div className={styles.container}>
          <div className={styles.topOneLine}>
            <p>{data.feedback?.one_line}</p>
          </div>
          <div className={styles.feedback}>{data.feedback?.feedback}</div>
        </div>
      </section>
      {/* 오개념 */}
      <section className={styles.column}>
        <div className={`${styles.sectionTitle}`}>
          {hasMisconception ? (
            <SearchXIcon
              className={`${hasMisconception ? styles.redText : styles.greenText}`}
            />
          ) : (
            <SearchCheckIcon
              className={`${hasMisconception ? styles.redText : styles.greenText}`}
            />
          )}
          <h3
            className={`${hasMisconception ? styles.redText : styles.greenText}`}
          >
            오개념 분석
          </h3>
        </div>
        {/* 오개념 존재 여부에 따라 렌더링 */}
        {hasMisconception ? (
          <div className={`${styles.container}`}>
            <div className={`${styles.misconception}`}>
              {data.feedback?.misconception?.summary}
            </div>
            <div className={styles.yourAnswer}>
              <span>{data.feedback?.misconception?.evidence}</span>
            </div>
            <div className={styles.feedback}>
              {data.feedback?.misconception?.explanation}
            </div>
          </div>
        ) : (
          <div className={styles.container}>
            <div className={`${styles.topOneLine} ${styles.dontMisconception}`}>
              답변에 오개념이 없습니다.
            </div>
          </div>
        )}
      </section>

      {/* 음성 발화 */}
      <section className={styles.column}>
        <div className={`${styles.sectionTitle}`}>
          <QuoteIcon
            className={`${styles.defaultText}`}
            style={{ marginTop: '2px' }}
          />
          <h3 className={`${styles.defaultText}`}>음성 분석</h3>
        </div>
        {data.voice && <Voice data={data.voice} />}
      </section>

      {/* 얼굴 */}
      <section className={styles.column}>
        <div className={`${styles.sectionTitle}`}>
          <SmileIcon
            className={`${styles.defaultText}`}
            style={{ marginTop: '2px' }}
          />
          <h3 className={`${styles.defaultText}`}>얼굴 / 집중도 분석</h3>
        </div>
        {'준비 중입니다.'}
      </section>
    </div>
  );
};

const Cards = ({ data }: { data: VoicePublic }) => {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes === 0) {
      return `${seconds}s`;
    }

    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className={styles.cards}>
      <div className={`${styles.card} ${styles.blue}`}>
        <ClockIcon className={styles.icon} />
        <p className={styles.title}>{formatTime(data.duration_ms)}</p>
        <p className={styles.desc}>총 시간</p>
      </div>
      <div className={`${styles.card} ${styles.green}`}>
        <MicIcon className={styles.icon} style={{ marginLeft: '-1px' }} />
        <p className={styles.title}>
          {formatTime(data.speech_ms - data.filler_ms)}
        </p>
        <p className={styles.desc}>발화 시간</p>
      </div>
      <div className={`${styles.card} ${styles.amber}`}>
        <VolumeXIcon className={styles.icon} />
        <p className={styles.title}>{formatTime(data.silence_ms)}</p>
        <p className={styles.desc}>침묵 시간</p>
      </div>
      <div className={`${styles.card} ${styles.gray}`}>
        <PauseIcon className={styles.icon} style={{ marginLeft: '-2px' }} />
        <p className={styles.title}>{formatTime(data.filler_ms)}</p>
        <p className={styles.desc}>filler words (..어, 음)</p>
      </div>
    </div>
  );
};

const Voice = ({ data }: { data: VoicePublic }) => {
  const chartData = [
    {
      name: '발화',
      value: data.speech_ms - data.filler_ms,
      color: 'var(--primary)',
    },
    { name: '침묵', value: data.silence_ms, color: 'var(--neutral-5)' },
    { name: 'filler', value: data.filler_ms, color: 'var(--warning)' },
  ];

  const dist = {
    head: data.pause_hygiene.pause_distribution.head,
    body: data.pause_hygiene.pause_distribution.body,
    tail: data.pause_hygiene.pause_distribution.tail,
  };

  return (
    <div className={styles.container}>
      <div className={styles.voiceHeader}>
        {/* 왼쪽 */}
        <div className={styles.voiceHeaderLeft}>
          <ActivityIcon />
          <div className={styles.voiceHeaderLeftInfo}>
            <p className={styles.title}>전체 발화 분석</p>
            <p className={styles.desc}>
              질문에 답변한 음성을 분석한 결과입니다.
            </p>
          </div>
        </div>
      </div>
      <div className={styles.voiceContent}>
        <Cards data={data} />

        <div className={styles.voiceGrid}>
          <div className={styles.voiceGridItem}>
            <div className={styles.voiceContentTitle}>
              <h4>침묵 구간 비중</h4>
              <span>
                문장 앞, 중간, 끝의 침묵 비중입니다. 문장 끝으로 갈수록 침묵
                비중이 높아졌다면, 뒤로 갈수록 발화를 주저했을 수 있습니다.
                반대라면 뒤로 갈수록 자신감이 생겨 발화를 수월하게 했다는
                뜻입니다.
              </span>
            </div>
            <div className={styles.voiceChart}>
              <RechartsLollipopWithGuide
                distribution={dist}
                totalDurationMs={data.duration_ms}
              />
            </div>
          </div>
          <div className={styles.voiceGridItem}>
            <div className={styles.voiceContentTitle}>
              <h4>발화 구성 비율</h4>
            </div>
            <div className={styles.voiceChart}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    isAnimationActive={false}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) =>
                      `${Math.floor(value / 1000)}초`
                    }
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type PauseDistribution = {
  head: number;
  body: number;
  tail: number;
};

export function RechartsLollipopWithGuide({
  distribution,
  totalDurationMs,
}: {
  distribution: PauseDistribution;
  totalDurationMs?: number;
}) {
  const thresholdPct = 33;
  const basis = 'totalSilence';

  const rows = useMemo(() => {
    const { head, body, tail } = distribution;
    const totalSilenceSec = Math.max(0.0001, head + body + tail);
    const basisSec = totalSilenceSec;

    const raw = [
      { position: '문장 시작', sec: head },
      { position: '문장 중간', sec: body },
      { position: '문장 끝', sec: tail },
    ].map((r) => ({ ...r, pct: (r.sec / basisSec) * 100 }));

    // 최대값 인덱스
    let idxMax = 0;
    for (let i = 1; i < raw.length; i++) {
      if (raw[i].pct > raw[idxMax].pct) idxMax = i;
    }
    return raw.map((r, i) => ({
      ...r,
      over: r.pct >= thresholdPct,
      isMax: i === idxMax,
    }));
  }, [distribution, basis, totalDurationMs, thresholdPct]);

  const CustomTooltip = ({ active, label, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const p = payload[0];
    const pct = Number(p.value || 0);
    const sec = Number(p.payload?.sec || 0);

    return (
      <div
        style={{
          background: 'rgba(255,255,255,0.95)',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          padding: '6px 8px',
          fontSize: 12,
        }}
      >
        <div style={{ fontWeight: 600, color: 'var(--neutral-7)' }}>
          {label}
        </div>
        <div style={{ color: 'var(--neutral-6)' }}>
          비율: {pct.toFixed(1)}% · {sec.toFixed(2)}s
        </div>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={rows}
        layout="vertical"
        margin={{ top: 5, right: 16, bottom: 8, left: -17 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={true}
          horizontal={false}
          stroke="var(--neutral-3)"
        />
        <XAxis
          type="number"
          domain={[0, 100]}
          ticks={[0, 15, 25, 33, 50, 75, 100]}
          tick={{ fontSize: 11, fill: 'var(--neutral-5)' }}
          axisLine={{ stroke: 'var(--neutral-4)' }}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <YAxis
          type="category"
          dataKey="position"
          width={70}
          tickLine={false}
          tick={{ fontSize: 12, fill: 'var(--neutral-6)' }}
          axisLine={{ stroke: 'var(--neutral-4)' }}
        />

        {/* 임계선: */}
        <ReferenceLine
          x={thresholdPct}
          stroke="var(--neutral-5)"
          strokeDasharray="4 4"
          ifOverflow="extendDomain"
        />
        <Bar
          dataKey="pct"
          name=""
          barSize={6}
          radius={[1, 3, 3, 1]}
          background={false}
        >
          {rows.map((row, i) => {
            const fill = row.isMax ? 'var(--danger)' : 'var(--neutral-5)';
            return <Cell key={i} fill={fill} />;
          })}
        </Bar>
        {/* 끝점(dot) */}
        <Scatter
          dataKey="pct"
          shape={(props: any) => {
            const { cx, cy, payload } = props;
            const { isMax, over } = payload || {};
            const fill = isMax ? 'var(--danger)' : 'var(--neutral-5)';
            const ring = isMax ? '#fee2e2' : 'var(--neutral-3)';
            return (
              <circle
                cx={cx}
                cy={cy}
                r={6}
                fill={fill}
                stroke={ring}
                strokeWidth={3}
              />
            );
          }}
        />

        <Tooltip content={<CustomTooltip />} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default ResultClient;
