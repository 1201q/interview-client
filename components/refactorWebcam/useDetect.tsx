import {
  faceDetected$,
  faceResult$,
  gestureResults$,
} from '@/store/observable';
import Human from '@vladmandic/human';
import { RefObject, useRef } from 'react';

export const useDetect = (
  human: Human,
  videoRef: RefObject<HTMLVideoElement | null>,
) => {
  const animationFrameRef = useRef<number>(null);
  const isDetectingRef = useRef(false);
  const lastTimeRef = useRef(0);

  const fps = 20;
  const interval = 1000 / fps;

  const detect = async (timestamp: number) => {
    if (!isDetectingRef.current) return;

    const elapsed = timestamp - lastTimeRef.current;
    if (elapsed > interval) {
      lastTimeRef.current = timestamp;

      const video = videoRef.current;
      if (video && !video.paused) {
        const result = await human.detect(video);
        const faceDetected = result.face.length > 0;
        const faceResult = result.face[0];

        faceDetected$.next(faceDetected);
        gestureResults$.next(result.gesture);

        if (faceResult) {
          faceResult$.next(faceResult);
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(detect);
  };

  const startDetection = () => {
    if (isDetectingRef.current) return;
    console.log('2. detection을 시작합니다.');
    isDetectingRef.current = true;
    animationFrameRef.current = requestAnimationFrame(detect);
  };

  const stopDetection = () => {
    if (animationFrameRef.current) {
      console.log('2. detection을 중지합니다.');
      cancelAnimationFrame(animationFrameRef.current);
    }
    isDetectingRef.current = false;
  };

  return { startDetection, stopDetection };
};
