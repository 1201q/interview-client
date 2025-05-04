import { useEffect, useRef } from 'react';
import styles from './webcam.module.css';
import WebcamVideo from './WebcamVideo';
import WebcamCanvas from './WebcamCanvas';
import { useAtomValue } from 'jotai';
import { initHumanAtom } from '@/store/webcam';

import { useDetectionLoop } from './useDetectionLoop';
import { PersonResult } from '@vladmandic/human';
import { initWebcam } from './initWebcam';
import { useDrawLoop } from './useDrawLoop';

interface ResultBuffer {
  timestamp: number;
  data: PersonResult;
}

const NewWebcam = ({
  isRunning,
  afterInit,
}: {
  isRunning: boolean;
  afterInit: () => void;
}) => {
  const human = useAtomValue(initHumanAtom);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bufferRef = useRef<ResultBuffer[]>([]);

  const { startDetection, stopDetection } = useDetectionLoop(
    human,
    videoRef,
    bufferRef,
  );
  const { startDrawing, stopDrawing } = useDrawLoop(human, videoRef, canvasRef);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !human) return;

    const setupCamera = async () => {
      const init = initWebcam(human, videoRef, canvasRef, afterInit);
      await init();
    };

    setupCamera();

    return () => {
      stopDetection();
      stopDrawing();
      human.webcam.stop();
    };
  }, [human]);

  useEffect(() => {
    if (human && isRunning) {
      startDetection();
      startDrawing();
    }
  }, [human, isRunning]);

  return (
    <>
      <WebcamVideo ref={videoRef} className={styles.hiddenVideo} />
      <WebcamCanvas ref={canvasRef} className={styles.drawCanvas} />
    </>
  );
};

export default NewWebcam;
