import { useEffect, useRef } from 'react';
import styles from './webcam.module.css';
import { useAtomValue } from 'jotai';
import { initHumanAtom } from '@/store/webcam';
import { initWebcam } from './initWebcam';
import { useDetect } from './useDetect';
import { useDraw } from './useDraw';

interface Props {
  isRunning: boolean;
}

const RWebcam = ({ isRunning }: Props) => {
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
      startDrawing({ face: true, body: true, hand: true });
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
