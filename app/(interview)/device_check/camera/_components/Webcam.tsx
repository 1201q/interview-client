'use client';

import { dayjsFn } from '@/utils/libs/dayjs';
import styles from './styles/webcam.module.css';
import { initHumanAtom } from '@/store/webcam';
import Human, { DrawOptions } from '@vladmandic/human';
import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';

const DRAW_OPTIONS: Partial<DrawOptions> = {
  drawPolygons: false,
  faceLabels: `[score]%
    [distance]
    roll: [roll]° yaw:[yaw]° pitch:[pitch]°
  `,
};

interface Props {
  autoStart?: boolean;
  isRunning: boolean;
}

const Webcam = ({ isRunning }: Props) => {
  const humanInstance = useAtomValue(initHumanAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const animationFrameRef = useRef<number>(null);

  useEffect(() => {
    if (!humanInstance) return;

    const setupAndStartDetection = async () => {
      await setupWebcam();

      startDetection();
    };

    setupAndStartDetection();
  }, [humanInstance]);

  useEffect(() => {
    if (!humanInstance) return;

    if (isRunning) {
      startDetection();
    } else {
      pauseDetection();
    }
  }, [humanInstance, isRunning]);

  useEffect(() => {
    return () => {
      console.log('cleanup');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (humanInstance) humanInstance.webcam.stop();
    };
  }, [humanInstance]);

  const setupWebcam = async () => {
    await humanInstance.warmup();
    await initWebcam(humanInstance);
  };

  const initWebcam = async (human: Human) => {
    console.log('❗❗❗initWebcam❗❗❗');

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video) {
      console.error('No video element found');
      alert('No video element found');

      return;
    }

    const devices = await human.webcam.enumerate();
    const id = devices[0]?.deviceId;

    if (!id) {
      console.error('No webcam found');
      alert('No webcam found');
      return;
    }

    const ready = await human.webcam.start({
      element: video,
      crop: false,
      id,
    });

    if (canvas) {
      canvas.width = human.webcam.width;
      canvas.height = human.webcam.height;
    }
  };

  const startDetection = async () => {
    const video = videoRef.current;

    if (video?.paused) {
      await video.play();
    }

    detectionLoop(humanInstance);
    drawLoop(humanInstance);
  };

  const pauseDetection = async () => {
    if (videoRef.current) {
      humanInstance.webcam.pause();
    }
  };

  const detectionLoop = async (human: Human) => {
    const video = videoRef.current;

    if (video && !video.paused) {
      await human.detect(video);
    }

    animationFrameRef.current = requestAnimationFrame(() =>
      detectionLoop(human),
    );
  };

  const drawLoop = async (human: Human) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && !video.paused) {
      const interpolated = human.next(human.result);
      const processed = await human.image(video);

      if (canvas) {
        human.draw.canvas(processed.canvas as HTMLCanvasElement, canvas);
        await human.draw.all(canvas, interpolated, DRAW_OPTIONS);
      }
    }

    timeoutRef.current = setTimeout(() => drawLoop(human), 60);
  };

  return (
    <div className={styles.container}>
      <div className={styles.webcamContainer}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={styles.hiddenVideo}
        />
        <canvas ref={canvasRef} className={styles.drawCanvas} />
      </div>
    </div>
  );
};

export default Webcam;
