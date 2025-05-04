'use client';

import styles from './styles/webcam.module.css';
import { initHumanAtom, isHumanLoadedAtom } from '@/store/webcam';
import Human, { DrawOptions, PersonResult } from '@vladmandic/human';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import { isFacingCenter } from './utils/face';
import { useCenter } from './hooks/useCenter';

const DRAW_OPTIONS: Partial<DrawOptions> = {
  drawPolygons: true,
  drawLabels: true,
  drawBoxes: false,
};

const FACE_DRAW_OPTIONS: Partial<DrawOptions> = {
  drawGaze: false,
  drawLabels: false,
  drawPolygons: false,
  faceLabels: `[score]%
  [distance]
  roll: [roll]° yaw:[yaw]° pitch:[pitch]°
`,
};

interface Props {
  isRunning: boolean;
  setCenterStatus: (center: boolean) => void;
  size: 'fill' | 'auto';
  afterInit: () => void;
}

interface ResultBuffer {
  timestamp: number;
  data: PersonResult;
}

const Webcam = ({
  isRunning,
  setCenterStatus,
  size = 'auto',
  afterInit,
}: Props) => {
  const humanInstance = useAtomValue(initHumanAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const animationFrameRef = useRef<number>(null);

  const bufferRef = useRef<ResultBuffer[]>([]);

  const isCenter = useCenter(isRunning, bufferRef);

  useEffect(() => {
    if (!humanInstance) return;

    const setupAndStartDetection = async () => {
      await setupWebcam();

      const video = videoRef.current;
      const processed = await humanInstance.image(video);
      const canvas = canvasRef.current;

      if (canvas) {
        humanInstance.draw.canvas(
          processed.canvas as HTMLCanvasElement,
          canvas,
        );
      }
    };

    setupAndStartDetection();

    return () => {
      console.log('cleanup');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (humanInstance) humanInstance.webcam.stop();
    };
  }, [humanInstance]);

  useEffect(() => {
    if (!humanInstance) return;

    if (isRunning) {
      startDetection();
    } else {
      pauseDetection();
      bufferRef.current = [];
    }
  }, [humanInstance, isRunning]);

  useEffect(() => {
    setCenterStatus(isCenter);
  }, [isCenter]);

  const setupWebcam = async () => {
    try {
      const status = await navigator.permissions.query({
        name: 'camera' as PermissionName,
      });

      if (status.state === 'denied') {
        alert('카메라 접근이 차단되었습니다. 브라우저 설정을 확인하세요.');
        return;
      }

      // 1. 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      stream.getTracks().forEach((track) => track.stop());

      // await humanInstance.warmup();
      await initWebcam(humanInstance);
    } catch (error) {
      console.error('카메라 권한 요청 실패', error);
      alert('카메라 권한을 허용해주세요.');
    }
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

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const devices = await human.webcam.enumerate();
    const id = devices[0]?.deviceId;

    if (!id) {
      console.error('No webcam found');
      alert('No webcam found');
      return;
    }

    await human.webcam.start({
      element: video,
      crop: true,
      id,
      mode: 'front',
      ...(size === 'fill' && { width: screenWidth, height: screenHeight }),
    });

    afterInit();

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
      const data = await human.detect(video);

      pushBuffer(data.persons[0]);
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
        human.draw.face(canvas, interpolated.face, FACE_DRAW_OPTIONS);
        human.draw.body(canvas, interpolated.body, DRAW_OPTIONS);
        human.draw.hand(canvas, interpolated.hand, DRAW_OPTIONS);
      }
    }

    timeoutRef.current = setTimeout(() => drawLoop(human), 60);
  };

  const pushBuffer = (data: PersonResult) => {
    const now = performance.now();
    bufferRef.current.push({ timestamp: now, data });
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

      <button
        onClick={() => {
          const now = performance.now();
          console.log(bufferRef.current);

          console.log(now - bufferRef.current[0].timestamp);
        }}
      >
        버튼
      </button>
    </div>
  );
};

export default Webcam;
