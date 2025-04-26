'use client';

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

const Webcam = ({ autoStart = false, isRunning }: Props) => {
  const humanInstance = useAtomValue(initHumanAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const animationFrameRef = useRef<number>(null);

  // 감지를 하고 있는지 여부를 담음.
  const detectingRef = useRef<boolean>(false);

  useEffect(() => {
    if (!humanInstance) return;

    const main = async (human: Human) => {
      await human.warmup();
      await startWebcam(human);
      detectionLoop(human);
      drawLoop(human);
    };

    main(humanInstance);

    return () => {
      if (timeoutRef.current) {
        console.log('clearTimeout');
        clearTimeout(timeoutRef.current);
      }
      if (animationFrameRef.current) {
        console.log('cancelAnimationFrame');
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (humanInstance) {
        console.log('stop webcam');
        humanInstance.webcam.stop();
      }
    };
  }, [humanInstance]);

  // const startDetection = async () => {
  //   if (detectingRef.current) return;

  //   detectingRef.current = true;

  //   await humanInstance.warmup();
  //   await startWebcam(humanInstance);
  //   drawLoop(humanInstance);
  // };

  const startWebcam = async (human: Human) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video) {
      console.error('No video element found');
      return;
    }

    const devices = await human.webcam.enumerate();

    const id = devices[0].deviceId;

    if (!id) {
      console.error('No webcam found');
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

      canvas.onclick = async () => {
        if (human.webcam.paused) await human.webcam.play();
        else human.webcam.pause();
      };
    }
  };

  const detectionLoop = async (human: Human) => {
    const video = videoRef.current;

    if (video && !video.paused) {
      const data = await human.detect(video);
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

        // console.log(interpolated);
      }
    }

    timeoutRef.current = setTimeout(() => drawLoop(human), 30);
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
