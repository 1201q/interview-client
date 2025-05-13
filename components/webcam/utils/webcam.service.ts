import { BehaviorSubject, combineLatest, map } from 'rxjs';

export const isCameraOn$ = new BehaviorSubject(false);
export const isHumanLoaded$ = new BehaviorSubject(false);

export const isDetectionReady$ = combineLatest([
  isCameraOn$,
  isHumanLoaded$,
]).pipe(map(([camera, model]) => camera && model));
