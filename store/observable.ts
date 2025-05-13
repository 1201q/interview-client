import { isFaceOrIrisCenter } from '@/utils/services/isFaceOrIrisCenter';
import { GestureResult } from '@vladmandic/human';
import {
  BehaviorSubject,
  bufferTime,
  combineLatest,
  distinctUntilChanged,
  map,
  pairwise,
  Subject,
} from 'rxjs';

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
