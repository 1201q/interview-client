'use client';

import { humanInstanceAtom } from '@/store/webcam';
import Human from '@vladmandic/human';
import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';

interface Props {
  size: { width: number; height: number };
}

const WebcamComponent = ({ size }: Props) => {
  const humanInstance = useAtomValue(humanInstanceAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!humanInstance) return;

    const main = async (human: Human) => {
      await human.warmup();
      await startWebcam(human);
      detectionLoop(human);
      drawLoop(human);
    };

    main(humanInstance);
  }, [humanInstance, size]);

  const startWebcam = async (human: Human) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video) return;

    const devices = await human.webcam.enumerate();
    const id = devices[0].deviceId;

    if (!id) {
      console.error('No webcam found');
      return;
    }

    await human.webcam.start({
      element: video,
      crop: false,
      width: size.width,
      height: size.height,
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
      await human.detect(video);
    }

    requestAnimationFrame(() => detectionLoop(human));
  };

  const drawLoop = async (human: Human) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && !video.paused) {
      const interpolated = human.next(human.result);
      const processed = await human.image(video);

      if (canvas) {
        human.draw.canvas(processed.canvas as HTMLCanvasElement, canvas);
        await human.draw.all(canvas, interpolated);
      }
    }

    setTimeout(() => drawLoop(human), 30);
  };

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '100%', display: 'none' }}
      />
      <canvas ref={canvasRef} />
    </>
  );
};

export default WebcamComponent;
