'use client';

import { PauseIcon, Play } from 'lucide-react';
import styles from './styles/r.client.module.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SegmentDto } from '@/utils/types/analysis';

interface VoicePlayerProps {
  rawSegments: SegmentDto[];
  answerId: string;
}

const VoicePlayer = ({ rawSegments, answerId }: VoicePlayerProps) => {
  // ===== 오디오  =====
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const [audioReady, setAudioReady] = useState(false);

  const toSeconds = (v: number) => (v > 1000 ? v / 1000 : v);

  const segments = useMemo(() => {
    return (rawSegments ?? []).map((s: SegmentDto) => ({
      ...s,
      startSec: toSeconds(s.start),
      endSec: toSeconds(s.end),
      display: s.refined_text ?? s.text,
    }));
  }, [rawSegments]);

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
  }, [answerId]);

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

  // currentTime 변동 시 현재 인덱스 계산
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
        {rawSegments.map((s, index) => {
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
  );
};

export default VoicePlayer;
