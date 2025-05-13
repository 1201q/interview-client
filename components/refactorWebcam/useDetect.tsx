import { faceDetected$, gestureResults$ } from '@/store/observable';
import Human from '@vladmandic/human';
import { RefObject, useRef } from 'react';

export const useDetect = (
  human: Human,
  videoRef: RefObject<HTMLVideoElement | null>,
) => {
  const animationFrameRef = useRef<number>(null);
  const isDetectingRef = useRef(false);

  const detect = async () => {
    if (!isDetectingRef.current) return;
    const video = videoRef.current;

    if (video && !video.paused) {
      const result = await human.detect(video);
      const faceDetected = result.face.length > 0;

      faceDetected$.next(faceDetected);
      gestureResults$.next(result.gesture);
    }

    animationFrameRef.current = requestAnimationFrame(detect);
  };

  const startDetection = () => {
    if (isDetectingRef.current) return;
    console.log('2. detection을 시작합니다.');
    isDetectingRef.current = true;
    detect();
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
