'use client';

import { VoicePublic } from '@/utils/types/analysis';
import styles from './styles/r.client.module.css';

import {
  ActivityIcon,
  ClockIcon,
  MicIcon,
  VolumeXIcon,
  PauseIcon,
} from 'lucide-react';
import { useMemo } from 'react';

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

type PauseDistribution = {
  head: number;
  body: number;
  tail: number;
};

const VoiceResult = ({ data }: { data: VoicePublic }) => {
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

const RechartsLollipopWithGuide = ({
  distribution,
  totalDurationMs,
}: {
  distribution: PauseDistribution;
  totalDurationMs?: number;
}) => {
  const thresholdPct = 33;

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
  }, [distribution, thresholdPct]);

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
};

export default VoiceResult;
