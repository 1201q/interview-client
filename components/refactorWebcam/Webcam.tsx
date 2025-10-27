import { useEffect, useRef } from 'react';
import styles from './webcam.module.css';
import { useAtomValue, useSetAtom } from 'jotai';
import { initHumanAtom, webcamStreamAtom } from '@/store/webcam';
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
  cameraObjectFitOpt?: 'cover' | 'contain';
}

const Webcam = ({ isRunning, drawTargets, cameraObjectFitOpt }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const human = useAtomValue(initHumanAtom);

  const setWebcamStream = useSetAtom(webcamStreamAtom);

  const { startDetection, stopDetection } = useDetect(human, videoRef);
  const { startDrawing, stopDrawing } = useDraw(human, videoRef, canvasRef);

  useEffect(() => {
    if (!human) return;

    const setup = async () => {
      const init = initWebcam(human, videoRef, canvasRef);
      await init();

      const stream =
        (videoRef.current?.srcObject as MediaStream | null) ??
        (human.webcam as any)?.stream ??
        null;

      if (stream) setWebcamStream(stream);
    };

    setup();

    return () => {
      setWebcamStream(null);
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
      <canvas
        ref={canvasRef}
        className={`${styles.canvas} ${cameraObjectFitOpt === 'cover' ? styles.cover : styles.contain}`}
      />
    </>
  );
};

export default Webcam;
