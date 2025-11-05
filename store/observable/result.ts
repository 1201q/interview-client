import { bufferToggle, filter, map, shareReplay, withLatestFrom } from 'rxjs';
import { answerStart$, answerEnd$ } from './raw';
import { GazeState, stableGazeState$ } from './gaze';
import { EmotionState, stableEmotionState$ } from './emotion';

export type FaceFrameState = {
  timestamp: number;
  gaze: GazeState;
  emotion: EmotionState;
  faceDetected: boolean;
};

// 답변 프레임 상태 스트림
export const faceFrameState$ = stableGazeState$.pipe(
  withLatestFrom(stableEmotionState$),
  map(
    ([gaze, emotion]): FaceFrameState => ({
      timestamp: Math.max(gaze.timestamp, emotion.timestamp),
      faceDetected: gaze.faceDetected,
      gaze,
      emotion,
    }),
  ),
  shareReplay(1),
);

export const recordedFaceData$ = faceFrameState$.pipe(
  bufferToggle(answerStart$, () => answerEnd$),
  filter((arr) => arr.length > 0),
);
