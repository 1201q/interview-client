import { isFaceOrIrisCenter } from '@/utils/services/isFaceOrIrisCenter';
import { GestureResult } from '@vladmandic/human';
import {
  BehaviorSubject,
  bufferTime,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  Subject,
} from 'rxjs';

type LeaningDirection = 'left' | 'right' | 'none';
type HandRaised = 'left' | 'right' | 'both' | 'none';
type FacingDirection = 'left' | 'right' | 'center' | 'none';
type HeadTiltDirection = 'up' | 'down' | 'none';
type IrisDirection = 'center' | 'up' | 'down' | 'right' | 'left' | 'none';

// 얼굴이 감지되었는지
export const faceDetected$ = new Subject<boolean>();

// distinct 얼굴이 감지되었는지
export const distinctFaceDetected$ = faceDetected$.pipe(distinctUntilChanged());

// gesture results
export const gestureResults$ = new Subject<GestureResult[]>();

// 0.25초동안 gesture의 50%가 center인지
export const isFaceOrIrisCenter$ = gestureResults$.pipe(
  bufferTime(250),
  map((results) => {
    if (results.length === 0) return false;

    const count = results.filter(isFaceOrIrisCenter).length;
    const ratio = count / results.length;

    return ratio >= 0.5;
  }),
  distinctUntilChanged(),
);

// 5초동안 얼굴이 중간인지 체크
export const isLookingCenter$ = combineLatest([
  faceDetected$,
  isFaceOrIrisCenter$,
]).pipe(
  map(([face, center]) => face && center),

  distinctUntilChanged(),
);

export const faceCenterCheck$ = isLookingCenter$.pipe(
  bufferTime(5000),
  map((results) => results.length > 0 && results.every(Boolean)),
  distinctUntilChanged(),
);

// 06월 3일 새로 작성
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

    console.log(filtered);

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
