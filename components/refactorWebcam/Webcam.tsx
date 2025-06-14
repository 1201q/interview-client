import { useEffect, useRef } from 'react';
import styles from './webcam.module.css';
import { useAtomValue } from 'jotai';
import { initHumanAtom } from '@/store/webcam';
import { initWebcam } from './initWebcam';
import { useDetect } from './useDetect';
import { useDraw } from './useDraw';

interface DrawTargets {
  face?: boolean;
  body?: boolean;
  hand?: boolean;
}

interface Props {
  isRunning: boolean;
  drawTargets: DrawTargets;
}

const RWebcam = ({ isRunning, drawTargets }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const human = useAtomValue(initHumanAtom);

  const { startDetection, stopDetection } = useDetect(human, videoRef);
  const { startDrawing, stopDrawing } = useDraw(human, videoRef, canvasRef);

  useEffect(() => {
    if (!human) return;

    const setup = async () => {
      const init = initWebcam(human, videoRef, canvasRef);
      await init();
    };

    setup();

    return () => {
      stopDetection();
      stopDrawing();
      human.webcam.stop();
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      startDetection();
      startDrawing(drawTargets);
      human.webcam.play();
    } else {
      stopDetection();
      stopDrawing();
      human.webcam.pause();
    }
  }, [isRunning]);

  return (
    <>
      <video ref={videoRef} className={styles.video} playsInline autoPlay />
      <canvas ref={canvasRef} className={styles.canvas} />
    </>
  );
};

export default RWebcam;
