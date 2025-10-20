// store/gaze-center.ts
import {
  BehaviorSubject,
  Subject,
  Subscription,
  filter,
  map,
  scan,
  startWith,
  switchMap,
  takeUntil,
  tap,
  timestamp,
} from 'rxjs';
import type { FaceResult } from '@vladmandic/human';
import { faceResult$, faceDetected$ } from './observable';

// === [추가] 방향 라벨 스트림 (이전 답에서 제안한 것) ===
export type OffDir = 'center' | 'left' | 'right' | 'up' | 'down';
export const gazeOffDir$ = new BehaviorSubject<OffDir>('center');

// === [추가] 방향별 총 지속시간(ms) ===
export type DirTotals = Record<OffDir, number>;
export const gazeDirTotals$ = new BehaviorSubject<DirTotals>({
  center: 0,
  left: 0,
  right: 0,
  up: 0,
  down: 0,
});

// === [추가] 타임라인 이벤트 로그 ===
export type GazeEvent =
  | { type: 'dir-start'; dir: OffDir; t: number }
  | { type: 'dir-end'; dir: OffDir; t: number; durMs: number }
  | { type: 'state-change'; state: 'center' | 'off'; t: number };

const MAX_EVENTS = 200; // 메모리 보호용 (필요시 조절)
export const gazeEvents$ = new BehaviorSubject<GazeEvent[]>([]);

// === [추가] 내부 런타임: 현재 OFF-방향 에피소드 상태 ===
const dirRuntime = {
  currDir: 'center' as OffDir,
  dirSince: 0, // performance.now()
};

export type GazeDebug = {
  score: number;
  ewma: number;
  yaw: number;
  pitch: number;
  irisDx: number;
  irisDy: number;
  faceR: number;
  onThresh: number;
  offThresh: number;
};
export const gazeDebug$ = new BehaviorSubject<GazeDebug>({
  score: 0,
  ewma: 0,
  yaw: 0,
  pitch: 0,
  irisDx: 0,
  irisDy: 0,
  faceR: 0,
  onThresh: 0.6,
  offThresh: 0.45,
});

// ==== 공개 API ====
// 1) 제어
export const startCalibration$ = new Subject<void>();
export const startGaze$ = new Subject<void>();
export const stopGaze$ = new Subject<void>();

// 2) 실시간 상태
export const gazePhase$ = new BehaviorSubject<
  'idle' | 'calibrating' | 'running'
>('idle'); // 진행 단계
export const gazeState$ = new BehaviorSubject<'center' | 'off'>('off'); // 중앙 응시 on/off
export const centerDwellPct$ = new BehaviorSubject<number>(0); // 중앙 응시율(%)

// 3) 세션 요약
export type GazeStats = {
  validFrames: number;
  centerFrames: number;
  offEpisodes: number;
  maxOffStreakMs: number;
};
export const gazeStats$ = new BehaviorSubject<GazeStats>({
  validFrames: 0,
  centerFrames: 0,
  offEpisodes: 0,
  maxOffStreakMs: 0,
});

// ==== 파라미터(튜닝 포인트) ====
const CONFIG = {
  calibMs: 1500,
  fps: 20,
  thetaYawDeg: 5,
  thetaPitchDeg: 5,
  irisMaxX: 0.2,
  irisMaxY: 0.2,
  faceMaxR: 0.15,
  ewmaAlpha: 0.25,
  onThresh: 0.6,
  offThresh: 0.45,
  dwellMs: 400,
};

// ==== 내부 상태 ====
type Calib = {
  yaw0: number;
  pitch0: number;
  irisX0: number;
  irisY0: number;
  faceCX0: number;
  faceCY0: number;
};
const calibRef: { current: Calib | null } = { current: null };

const accum = {
  validFrames: 0,
  centerFrames: 0,
  offEpisodes: 0,
  maxOffStreakMs: 0,
  offStreakStart: null as number | null,
};

const runtime = {
  ewma: 0,
  state: 'off' as 'center' | 'off',
  dwellOnStart: 0,
  dwellOffStart: 0,
};

let runningSub: Subscription | null = null;

// ==== 유틸 ====
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const median = (arr: number[]) => {
  if (arr.length === 0) return 0;
  const a = [...arr].sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
};

// yaw: (33 vs 263)의 z/x 비율 → 각도 근사(deg)
function estimateYaw(face: FaceResult): number {
  const zDiff = (face.mesh?.[33]?.[2] ?? 0) - (face.mesh?.[263]?.[2] ?? 0);
  const xDiff = (face.mesh?.[33]?.[0] ?? 0) - (face.mesh?.[263]?.[0] ?? 0);
  if (!xDiff) return 0;
  return (Math.atan(zDiff / xDiff) * 180) / Math.PI;
}

// pitch: 턱 깊이(152 z) 상대값 사용(캘리브레이션으로 0점 이동)
function estimatePitch(face: FaceResult): number {
  return (face.mesh?.[152]?.[2] ?? 0) as number;
}

// iris 오프셋(정규화) 평균
function estimateIrisOffsets(face: FaceResult): { dx: number; dy: number } {
  const boxW = Math.max(1e-6, face.box?.[2] ?? 1);
  const boxH = Math.max(1e-6, face.box?.[3] ?? 1);

  const leftIris = face.annotations?.leftEyeIris?.[0];
  const rightIris = face.annotations?.rightEyeIris?.[0];
  if (!leftIris || !rightIris) return { dx: 0, dy: 0 };

  const lX = Math.abs((face.mesh?.[263]?.[0] ?? 0) - leftIris[0]) / boxW;
  const rX = Math.abs((face.mesh?.[33]?.[0] ?? 0) - rightIris[0]) / boxW;
  const lY = Math.abs((face.mesh?.[374]?.[1] ?? 0) - leftIris[1]) / boxH;
  const rY = Math.abs((face.mesh?.[145]?.[1] ?? 0) - rightIris[1]) / boxH;

  return { dx: 0.5 * (lX + rX), dy: 0.5 * (lY + rY) };
}

// 얼굴 중심(미간 근처) 정규화 좌표
function estimateFaceCenter(face: FaceResult): { cx: number; cy: number } {
  const mr = face.meshRaw?.[10];
  if (mr) return { cx: mr[0], cy: mr[1] };
  const [x, y, w, h] = face.box ?? [0, 0, 1, 1];
  return { cx: x + w / 2, cy: y + h / 2 };
}

// 프레임 점수 계산 (0~1)
function frameScore(face: FaceResult): number {
  if (!calibRef.current) return 0;
  const C = calibRef.current;

  const yaw = estimateYaw(face) - C.yaw0;
  const pitch = estimatePitch(face) - C.pitch0;
  const { dx, dy } = estimateIrisOffsets(face);
  const { cx, cy } = estimateFaceCenter(face);

  const headYawScore = clamp01(1 - Math.abs(yaw) / CONFIG.thetaYawDeg);
  const headPitchScore = clamp01(1 - Math.abs(pitch) / CONFIG.thetaPitchDeg);

  const irisXErr = Math.abs(dx - C.irisX0);
  const irisYErr = Math.abs(dy - C.irisY0);
  const irisXScore = clamp01(1 - irisXErr / CONFIG.irisMaxX);
  const irisYScore = clamp01(1 - irisYErr / CONFIG.irisMaxY);
  const irisScore = 0.5 * (irisXScore + irisYScore);

  const r = Math.hypot(cx - C.faceCX0, cy - C.faceCY0);
  const faceScore = clamp01(1 - r / CONFIG.faceMaxR);

  const score = clamp01(
    0.5 * (0.6 * headYawScore + 0.4 * headPitchScore) +
      0.35 * irisScore +
      0.15 * faceScore,
  );
  return score;
}

// === [추가] 부호 있는 방향 결합 (yaw/pitch + iris) ===
function signedDirection(face: FaceResult): OffDir {
  if (!calibRef.current) return 'center';
  const C = calibRef.current;

  const yaw = estimateYaw(face) - C.yaw0; // deg
  const pitch = estimatePitch(face) - C.pitch0; // 상대값(환경 부호 확인 필요)
  const { dx, dy } = estimateIrisOffsets(face);

  // 무차원 정규화
  const nx = Math.max(-1, Math.min(1, yaw / CONFIG.thetaYawDeg));
  const ny = Math.max(-1, Math.min(1, pitch / CONFIG.thetaPitchDeg));
  const sx = Math.max(-1, Math.min(1, (dx - C.irisX0) / CONFIG.irisMaxX));
  const sy = Math.max(-1, Math.min(1, (dy - C.irisY0) / CONFIG.irisMaxY));

  // 수평/수직 결합(가중치는 상황에 따라 조정)
  const hx = 0.6 * nx + 0.4 * sx; // (-) left, (+) right
  let vy = 0.6 * ny + 0.4 * sy; // (-) up,   (+) down
  // 만약 pitch 부호가 반대로 해석된다면: vy = 0.6 * (-ny) + 0.4 * sy;

  const ax = Math.abs(hx),
    ay = Math.abs(vy);
  const mag = Math.max(ax, ay);

  // 과민 반응 방지 그레이존 (0.4~0.6 튜닝)
  if (mag < 0.5) return 'center';

  if (ax >= ay) return hx < 0 ? 'left' : 'right';
  return vy < 0 ? 'up' : 'down';
}

// ==== 캘리브레이션 ====
startCalibration$.subscribe(() => {
  if (gazePhase$.value !== 'idle') return;
  gazePhase$.next('calibrating');

  // 버퍼
  const buf = {
    yaw: [] as number[],
    pitch: [] as number[],
    dx: [] as number[],
    dy: [] as number[],
    cx: [] as number[],
    cy: [] as number[],
  };

  const stop$ = new Subject<void>();
  const sub = faceResult$
    .pipe(
      takeUntil(stop$),
      timestamp(),
      tap(({ timestamp: ts }) => {
        // 시간 경과로 종료
        if (ts >= (sub as any)._startTs + CONFIG.calibMs) stop$.next();
      }),
    )
    .subscribe((fr) => {
      const face = fr.value as FaceResult;
      if (!face) return;
      const yaw = estimateYaw(face);
      const pitch = estimatePitch(face);
      const { dx, dy } = estimateIrisOffsets(face);
      const { cx, cy } = estimateFaceCenter(face);

      buf.yaw.push(yaw);
      buf.pitch.push(pitch);
      buf.dx.push(dx);
      buf.dy.push(dy);
      buf.cx.push(cx);
      buf.cy.push(cy);
    });

  // 시작 시각 저장
  (sub as any)._startTs = performance.now();

  stop$.subscribe(() => {
    sub.unsubscribe();

    calibRef.current = {
      yaw0: median(buf.yaw),
      pitch0: median(buf.pitch),
      irisX0: median(buf.dx),
      irisY0: median(buf.dy),
      faceCX0: median(buf.cx),
      faceCY0: median(buf.cy),
    };

    gazePhase$.next('idle');
  });
});

// ==== 러닝(실시간 판정) ====
startGaze$.subscribe(() => {
  if (gazePhase$.value !== 'idle' || !calibRef.current) return;
  gazePhase$.next('running');

  // 초기화
  runtime.ewma = 0;
  runtime.state = 'off';
  runtime.dwellOnStart = 0;
  runtime.dwellOffStart = 0;

  accum.validFrames = 0;
  accum.centerFrames = 0;
  accum.offEpisodes = 0;
  accum.maxOffStreakMs = 0;
  accum.offStreakStart = null;

  const interval = 1000 / CONFIG.fps;

  // 다운샘플링: faceDetected$로 pause된 프레임은 건너뛰기(선택)
  const filteredFace$ = faceResult$.pipe(
    // 사람 얼굴 없는 프레임은 skip (옵션)
    filter((f) => !!f),
  );

  runningSub = filteredFace$
    .pipe(
      // 타임스탬프 + FPS 제한
      timestamp(),
      scan(
        (acc, curr) => {
          const { timestamp: ts } = curr;
          if (ts - acc.lastTs < interval)
            return { lastTs: acc.lastTs, fr: null as FaceResult | null, ts };
          return { lastTs: ts, fr: curr.value as FaceResult, ts };
        },
        { lastTs: 0, fr: null as FaceResult | null, ts: 0 },
      ),
      filter((p) => !!p.fr),
    )
    .subscribe(({ fr }) => {
      const face = fr as FaceResult;

      // 1) 프레임 점수
      const s = frameScore(face);
      runtime.ewma =
        CONFIG.ewmaAlpha * s + (1 - CONFIG.ewmaAlpha) * runtime.ewma;

      // 디버그용 원시값도 뽑아서 전송
      const C = calibRef.current!;
      const yaw = estimateYaw(face) - C.yaw0;
      const pitch = estimatePitch(face) - C.pitch0;
      const { dx, dy } = estimateIrisOffsets(face);
      const { cx, cy } = estimateFaceCenter(face);
      const r = Math.hypot(cx - C.faceCX0, cy - C.faceCY0);

      const now = performance.now();
      const prev = runtime.state;
      let next = prev;

      const aboveOn = runtime.ewma >= CONFIG.onThresh;
      const belowOff = runtime.ewma <= CONFIG.offThresh;

      if (prev === 'off' && aboveOn) {
        if (!runtime.dwellOnStart) runtime.dwellOnStart = now;
        if (now - runtime.dwellOnStart >= CONFIG.dwellMs) {
          next = 'center';
          runtime.dwellOnStart = 0;

          // off streak 종료
          if (accum.offStreakStart !== null) {
            const streak = now - accum.offStreakStart;
            accum.maxOffStreakMs = Math.max(accum.maxOffStreakMs, streak);
            accum.offStreakStart = null;
          }
        }
      } else if (prev === 'center' && belowOff) {
        if (!runtime.dwellOffStart) runtime.dwellOffStart = now;
        if (now - runtime.dwellOffStart >= CONFIG.dwellMs) {
          next = 'off';
          runtime.dwellOffStart = 0;

          // off 에피소드 시작
          accum.offEpisodes += 1;
          accum.offStreakStart = now;
        }
      } else {
        // 그레이존 → dwell 초기화
        runtime.dwellOnStart = 0;
        runtime.dwellOffStart = 0;
      }

      runtime.state = next;
      gazeState$.next(next);

      gazeDebug$.next({
        score: s,
        ewma: runtime.ewma,
        yaw,
        pitch,
        irisDx: Math.abs(dx - C.irisX0),
        irisDy: Math.abs(dy - C.irisY0),
        faceR: r,
        onThresh: CONFIG.onThresh,
        offThresh: CONFIG.offThresh,
      });

      // 통계
      accum.validFrames += 1;
      if (next === 'center') accum.centerFrames += 1;

      const pct =
        accum.validFrames > 0
          ? Math.round((accum.centerFrames / accum.validFrames) * 100)
          : 0;
      centerDwellPct$.next(pct);

      // 현재 상태(prev/next)는 기존 로직에서 계산되어 runtime.state 에 반영됨.
      // dir: OFF일 때만 의미 있는 방향 라벨을 기록(원하면 CENTER 때도 계산 가능)
      const dir: OffDir =
        runtime.state === 'off' ? signedDirection(face) : 'center';
      gazeOffDir$.next(dir);

      // 타임라인 & 총합 누적
      const evs = gazeEvents$.value.slice();
      const totals = { ...gazeDirTotals$.value };

      // (1) 상태 변화 이벤트 로그
      const lastEvent = evs[evs.length - 1];
      if (
        evs.length === 0 ||
        (lastEvent?.type === 'state-change' &&
          lastEvent.state !== runtime.state)
      ) {
        evs.push({ type: 'state-change', state: runtime.state, t: now });
      }

      // (2) 방향 에피소드 상태 머신
      if (runtime.state === 'off') {
        // OFF 구간
        if (dirRuntime.currDir !== dir) {
          // 이전 dir 끝내기
          if (dirRuntime.currDir !== 'center' && dirRuntime.dirSince > 0) {
            const dur = now - dirRuntime.dirSince;
            totals[dirRuntime.currDir] =
              (totals[dirRuntime.currDir] ?? 0) + dur;
            evs.push({
              type: 'dir-end',
              dir: dirRuntime.currDir,
              t: now,
              durMs: Math.round(dur),
            });
          }
          // 새 dir 시작
          if (dir !== 'center') {
            dirRuntime.currDir = dir;
            dirRuntime.dirSince = now;
            evs.push({ type: 'dir-start', dir, t: now });
          } else {
            // center로 들어오면 시작은 안 하고 대기
            dirRuntime.currDir = 'center';
            dirRuntime.dirSince = 0;
          }
        }
      } else {
        // CENTER 구간: 진행 중인 OFF-방향 에피소드가 있으면 닫기
        if (dirRuntime.currDir !== 'center' && dirRuntime.dirSince > 0) {
          const dur = now - dirRuntime.dirSince;
          totals[dirRuntime.currDir] = (totals[dirRuntime.currDir] ?? 0) + dur;
          evs.push({
            type: 'dir-end',
            dir: dirRuntime.currDir,
            t: now,
            durMs: Math.round(dur),
          });
          dirRuntime.currDir = 'center';
          dirRuntime.dirSince = 0;
        }
      }

      // 스트림 갱신(이벤트는 최대 MAX_EVENTS 개 유지)
      while (evs.length > MAX_EVENTS) evs.shift();
      gazeEvents$.next(evs);
      gazeDirTotals$.next(totals);
    });
});

// ==== 정지 ====
stopGaze$.subscribe(() => {
  if (runningSub) {
    runningSub.unsubscribe();
    runningSub = null;
  }

  // 종료 시 최장 off streak 마감
  const now = performance.now();
  if (runtime.state === 'off' && accum.offStreakStart !== null) {
    const streak = now - accum.offStreakStart;
    accum.maxOffStreakMs = Math.max(accum.maxOffStreakMs, streak);
    accum.offStreakStart = null;
  }

  gazeStats$.next({
    validFrames: accum.validFrames,
    centerFrames: accum.centerFrames,
    offEpisodes: accum.offEpisodes,
    maxOffStreakMs: Math.round(accum.maxOffStreakMs),
  });

  const now2 = performance.now();
  const evs2 = gazeEvents$.value.slice();
  const totals2 = { ...gazeDirTotals$.value };

  if (dirRuntime.currDir !== 'center' && dirRuntime.dirSince > 0) {
    const dur = now2 - dirRuntime.dirSince;
    totals2[dirRuntime.currDir] = (totals2[dirRuntime.currDir] ?? 0) + dur;
    evs2.push({
      type: 'dir-end',
      dir: dirRuntime.currDir,
      t: now2,
      durMs: Math.round(dur),
    });
    dirRuntime.currDir = 'center';
    dirRuntime.dirSince = 0;
  }

  // 종료 시점의 state-change도 남기고 싶다면:
  evs2.push({ type: 'state-change', state: 'center', t: now2 });

  while (evs2.length > MAX_EVENTS) evs2.shift();
  gazeEvents$.next(evs2);
  gazeDirTotals$.next(totals2);

  gazePhase$.next('idle');
  gazeState$.next('off');
});
