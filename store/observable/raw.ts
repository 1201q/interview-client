import { FaceResult, GestureResult } from '@vladmandic/human';
import { Subject } from 'rxjs';

// raw 데이터
export const detectedFaceResult$ = new Subject<FaceResult>();
export const detectedGestureResults$ = new Subject<GestureResult[]>();

// 답변 세션 시작/종료 신호
export const answerStart$ = new Subject<void>();
export const answerEnd$ = new Subject<void>();
