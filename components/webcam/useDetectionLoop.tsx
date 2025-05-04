import Human, { PersonResult } from '@vladmandic/human';
import { RefObject, useRef } from 'react';

interface ResultBuffer {
  timestamp: number;
  data: PersonResult;
}

export const useDetectionLoop = (
  human: Human,
  videoRef: RefObject<HTMLVideoElement | null>,
  bufferRef: RefObject<ResultBuffer[]>,
) => {
  const animationFrameRef = useRef<number>(null);

  const detect = async () => {
    const video = videoRef.current;

    if (video && !video.paused) {
      const result = await human.detect(video);

      bufferRef.current.push({
        timestamp: performance.now(),
        data: result.persons[0],
      });
    }

    animationFrameRef.current = requestAnimationFrame(detect);
  };

  const startDetection = () => {
    console.log('2. detection을 시작합니다.');
    detect();
  };

  const stopDetection = () => {
    if (animationFrameRef.current) {
      console.log('2. detection을 중지합니다.');
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  return { startDetection, stopDetection };
};
