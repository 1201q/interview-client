import { FaceResult, GestureResult } from '@vladmandic/human';
import {
  BehaviorSubject,
  bufferTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { reduce } from 'rxjs/operators';

type LeaningDirection = 'left' | 'right' | 'none';
type HandRaised = 'left' | 'right' | 'both' | 'none';
type FacingDirection = 'left' | 'right' | 'center' | 'none';
type HeadTiltDirection = 'up' | 'down' | 'none';
type IrisDirection = 'center' | 'up' | 'down' | 'right' | 'left' | 'none';

type WarningKey =
  | 'leaningLeft'
  | 'leaningRight'
  | 'handLeft'
  | 'handRight'
  | 'giveUp'
  | 'facingLeft'
  | 'facingRight'
  | 'headUp'
  | 'headDown'
  | 'lookingCenter'
  | 'lookingDown'
  | 'lookingUp'
  | 'lookingLeft'
  | 'lookingRight'
  | 'faceNotCentered';

// 얼굴이 감지되었는지
export const faceDetected$ = new Subject<boolean>();

// distinct 얼굴이 감지되었는지
export const distinctFaceDetected$ = faceDetected$.pipe(distinctUntilChanged());

// gesture results
export const gestureResults$ = new Subject<GestureResult[]>();

//======================== 06월 3일 새로 작성
const leaning$ = gestureResults$.pipe(
  map((gestures: GestureResult[]): LeaningDirection => {
    const leanLeft = gestures.some(
      (g) =>
        typeof g.gesture === 'string' &&
        g.gesture.includes('leaning left') &&
        'body' in g,
    );
    const leanRight = gestures.some(
      (g) =>
        typeof g.gesture === 'string' &&
        g.gesture.includes('leaning right') &&
        'body' in g,
    );

    // 서로 반대, leaning left는 왼쪽 어깨 올라감 => 오른쪽으로 쏠림
    if (leanLeft) return 'right';
    if (leanRight) return 'left';
    return 'none';
  }),
);

export const leaningWarning$ = leaning$.pipe(
  bufferTime(250),
  map((buffer): LeaningDirection | null => {
    if (buffer.length === 0) return null;

    const first = buffer[0];
    const allSame = buffer.every((v) => v === first);
    return allSame ? first : null;
  }),
  filter((v): v is LeaningDirection => v !== null),
  distinctUntilChanged(),
);

const handRaised$ = gestureResults$.pipe(
  map((gestures: GestureResult[]): HandRaised => {
    const raiseLeft = gestures.some(
      (g) =>
        typeof g.gesture === 'string' &&
        g.gesture.includes('raise left hand') &&
        'body' in g,
    );
    const raiseRight = gestures.some(
      (g) =>
        typeof g.gesture === 'string' &&
        g.gesture.includes('raise right hand') &&
        'body' in g,
    );
    const giveUp = gestures.some(
      (g) =>
        typeof g.gesture === 'string' &&
        g.gesture === 'i give up' &&
        'body' in g,
    );

    if (giveUp) return 'both';
    if (raiseLeft && raiseRight) return 'both';

    // 역시 반대
    if (raiseLeft) return 'right';
    if (raiseRight) return 'left';
    return 'none';
  }),
);

export const handRaisedWarning$ = handRaised$.pipe(
  bufferTime(250),
  map((buffer): HandRaised | null => {
    if (buffer.length === 0) return null;
    const first = buffer[0];
    const allSame = buffer.every((v) => v === first);
    return allSame ? first : null;
  }),
  filter((v): v is HandRaised => v !== null),
  distinctUntilChanged(),
);

const facingDirection$ = gestureResults$.pipe(
  map((gestures: GestureResult[]): FacingDirection => {
    const facingLeft = gestures.some(
      (g) =>
        typeof g.gesture === 'string' &&
        g.gesture.includes('facing left') &&
        'face' in g,
    );
    const facingRight = gestures.some(
      (g) =>
        typeof g.gesture === 'string' &&
        g.gesture.includes('facing right') &&
        'face' in g,
    );

    const facingCenter = gestures.some(
      (g) =>
        typeof g.gesture === 'string' &&
        g.gesture.includes('facing center') &&
        'face' in g,
    );

    if (facingCenter) return 'center';
    if (facingLeft) return 'right';
    if (facingRight) return 'left';

    return 'none';
  }),
);

export const facingWarning$ = facingDirection$.pipe(
  bufferTime(250),
  map((buffer): FacingDirection | null => {
    if (buffer.length === 0) return null;
    const first = buffer[0];
    const allSame = buffer.every((v) => v === first);
    return allSame ? first : null;
  }),
  filter((v): v is FacingDirection => v !== null),
  distinctUntilChanged(),
);

const headTiltDirection$ = gestureResults$.pipe(
  map((gestures: GestureResult[]): HeadTiltDirection => {
    const headUp = gestures.some(
      (g) =>
        typeof g.gesture === 'string' &&
        g.gesture.includes('head up') &&
        'face' in g,
    );
    const headDown = gestures.some(
      (g) =>
        typeof g.gesture === 'string' &&
        g.gesture.includes('head down') &&
        'face' in g,
    );

    if (headUp) return 'up';
    if (headDown) return 'down';

    return 'none';
  }),
);

export const headTiltDirectionWarning$ = headTiltDirection$.pipe(
  bufferTime(250),
  map((buffer): HeadTiltDirection | null => {
    if (buffer.length === 0) return null;
    const first = buffer[0];
    const allSame = buffer.every((v) => v === first);
    return allSame ? first : null;
  }),
  filter((v): v is HeadTiltDirection => v !== null),
  distinctUntilChanged(),
);

const irisDirection$ = gestureResults$.pipe(
  map((gestures: GestureResult[]): IrisDirection => {
    const looking = gestures
      .filter(
        (g) =>
          typeof g.gesture === 'string' &&
          'iris' in g &&
          g.gesture.includes('looking'),
      )
      .map((g) => g.gesture);

    const facingCenter = gestures.filter(
      (g) =>
        typeof g.gesture === 'string' &&
        'iris' in g &&
        g.gesture.includes('facing center'),
    );

    const isFacingCenter = facingCenter.length !== 0;

    const lookingCenter = looking.includes('looking center');
    const lookingRight = looking.includes('looking right');
    const lookingLeft = looking.includes('looking left');
    const lookingDown = looking.includes('looking down');
    const lookingUp = looking.includes('looking up');

    if (isFacingCenter && lookingCenter) return 'center';
    if (isFacingCenter && lookingDown) return 'center';

    if (lookingRight) return 'left';
    if (lookingLeft) return 'right';
    if (lookingDown) return 'down';
    if (lookingUp) return 'up';
    if (lookingCenter) return 'center';

    return 'none';
  }),
);

export const irisDirectionWarning$ = irisDirection$.pipe(
  bufferTime(500),
  map((buffer): IrisDirection | null => {
    if (buffer.length === 0) return null;
    const filtered = buffer.filter((v) => v !== 'none');

    if (filtered.length === 0) return null;

    const dataMap = filtered.reduce<Record<IrisDirection, number>>(
      (acc, dir) => {
        acc[dir] = (acc[dir] ?? 0) + 1;
        return acc;
      },
      {} as Record<IrisDirection, number>,
    );

    const priority: IrisDirection[] = ['center', 'left', 'right', 'up', 'down'];

    let maxCount = 0;
    let selected: IrisDirection | null = null;

    for (const dir of priority) {
      const count = dataMap[dir] ?? 0;
      if (count > maxCount) {
        maxCount = count;
        selected = dir;
      }
    }

    return selected;
  }),
  filter((v): v is IrisDirection => v !== null),
  distinctUntilChanged(),
);

//======================== 얼굴 감지
export const faceResult$ = new Subject<FaceResult>();

// 얼굴이 원 안에 있는가?
const isInCircle$ = faceResult$.pipe(
  map((face: FaceResult) => {
    const [xRaw, yRaw] = face.meshRaw[10];

    return !(xRaw < 0.45 || xRaw > 0.55 || yRaw < 0.25 || yRaw > 0.4);
  }),
);

// 500ms마다 모든 체킹이 true인가?
export const isFaceInCircleWarning$ = isInCircle$.pipe(
  bufferTime(500),
  map((buffer: boolean[]) => {
    const isIn = buffer.every((v) => v);

    return isIn;
  }),
  distinctUntilChanged(),
);

//======================== 얼굴 검사 로직 수행 ==========
export const warnings$ = new BehaviorSubject<Set<WarningKey>>(new Set());

export const updateWarnings = (
  updater: (prev: Set<WarningKey>) => Set<WarningKey>,
) => {
  const current = warnings$.getValue();
  const updated = updater(current);
  warnings$.next(updated);
};

// ======================== 면접 세션동안의 데이터 축적 ==========

export const startFaceCapture$ = new Subject<void>();
export const stopFaceCapture$ = new Subject<void>();
export const capturedResult$ = new Subject<FaceResult[]>();

const source$ = faceResult$;

startFaceCapture$
  .pipe(
    switchMap(() =>
      source$.pipe(
        bufferTime(500),
        takeUntil(stopFaceCapture$),
        reduce((acc, curr) => [...acc, ...curr], [] as FaceResult[]),
      ),
    ),
  )
  .subscribe((data) => {
    capturedResult$.next(data);
  });

// 권한
// 권한을 감시
const subscribePermission = (
  name: PermissionName,
): Observable<PermissionState> => {
  return new Observable<PermissionState>((observer) => {
    navigator.permissions
      ?.query({ name })
      .then((status) => {
        observer.next(status.state);

        const handleChange = () => observer.next(status.state);
        status.addEventListener('change', handleChange);

        return () => status.removeEventListener('change', handleChange);
      })
      .catch(() => {
        observer.next('prompt');
        observer.complete();
      });
  });
};

export const cameraPermission$ = subscribePermission('camera');
export const micPermission$ = subscribePermission('microphone');
