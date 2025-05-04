import Human from '@vladmandic/human';
import { RefObject } from 'react';

export const initWebcam = (
  human: Human,
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  afterInit: () => void,
) => {
  return async () => {
    const devices = await human.webcam.enumerate();
    const id = devices[0]?.deviceId;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    await human.webcam.start({
      element: video!,
      crop: true,
      id,
      mode: 'front',
      width: 1920,
      height: 1080,
    });

    if (canvas) {
      canvas.width = human.webcam.width;
      canvas.height = human.webcam.height;
    }

    afterInit();
  };
};
