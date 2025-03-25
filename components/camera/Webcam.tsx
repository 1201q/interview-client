'use client';

import { detectionObserver } from '@/store/observer';
import { initHumanAtom } from '@/store/webcam';
import { Recorder } from '@/utils/libs/recorder';
import styles from './styles/webcam.module.css';

import Human, { DrawOptions, Result } from '@vladmandic/human';
import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';

// drawOptions = {
//   faceLabels: `face
//     confidence: [score]%
//     [gender] [genderScore]%
//     age: [age] years
//     distance: [distance]cm
//     real: [real]%
//     live: [live]%
//     [emotions]
//     roll: [roll]° yaw:[yaw]° pitch:[pitch]°
//     gaze: [gaze]°`,
//   bodyLabels: 'body [score]%',
//   bodyPartLabels: '[label] [score]%',
//   objectLabels: '[label] [score]%',
//   handLabels: '[label] [score]%',
//   fingerLabels: '[label]',
//   gestureLabels: '[where] [who]: [what]',
// };

const DRAW_OPTIONS: Partial<DrawOptions> = {
  drawPolygons: false,
  faceLabels: `[score]%
    [emotions]
    roll: [roll]° yaw:[yaw]° pitch:[pitch]°
  `,
};

const WebcamComponent = () => {
  const humanInstance = useAtomValue(initHumanAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const animationFrameRef = useRef<number>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<Recorder | undefined>(undefined);
  const [recordedUrl, setRecordedUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { width, height } = entry.contentRect;

        if (overlayRef.current) {
          const dpr = window.devicePixelRatio || 1;
          overlayRef.current.style.width = `${width}px`;
          overlayRef.current.style.height = `${height}px`;

          overlayRef.current.width = width * dpr;
          overlayRef.current.height = height * dpr;
        }
      });
    });

    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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

      console.log(data);
    }

    animationFrameRef.current = requestAnimationFrame(() =>
      detectionLoop(human),
    );
  };

  const drawLoop = async (human: Human) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;

    if (video && !video.paused) {
      const interpolated = human.next(human.result);
      const processed = await human.image(video);

      if (canvas) {
        human.draw.canvas(processed.canvas as HTMLCanvasElement, canvas);
        await human.draw.all(canvas, interpolated, DRAW_OPTIONS);

        console.log(interpolated);

        if (overlay && interpolated.face[0] && interpolated.face[0].distance) {
          drawOverlayCircle(overlay, interpolated.face[0].distance);
        }
      }
    }

    timeoutRef.current = setTimeout(() => drawLoop(human), 30);
  };

  const drawOverlayCircle = (canvas: HTMLCanvasElement, distance: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx || !window.devicePixelRatio) return;

    const width = canvas.width;
    const height = canvas.height;

    const centerX = width / 2;
    const centerY = height / 2;

    const base = Math.min(width, height) / 2;
    const raio = 0.6;
    const outer = base * raio;
    const inner = outer - 3;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.beginPath();

    ctx.arc(centerX, centerY, outer, 0, Math.PI * 2);
    ctx.arc(centerX, centerY, inner, 0, Math.PI * 2, true);

    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fill();

    ctx.restore();
  };

  const startRecording = async () => {
    const stream = await humanInstance.webcam.stream;

    if (!stream) return;

    const recorder = new Recorder(stream);

    setRecorder(recorder);
    setIsRecording(true);

    recorder.start();
  };

  const stopRecording = async () => {
    if (recorder) {
      recorder.stop();

      setTimeout(() => {
        const url = recorder.getVideoUrl();
        setRecordedUrl(url);
      });

      setIsRecording(false);
      setRecorder(undefined);
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={styles.hiddenVideo}
      />
      <canvas ref={canvasRef} className={styles.drawCanvas} />
      <canvas ref={overlayRef} className={styles.overlayCanvas} />
      <button
        onClick={() => {
          startRecording();
        }}
      >
        시작
      </button>
      <button
        onClick={() => {
          stopRecording();
        }}
      >
        스탑
      </button>
      {isRecording ? <>녹화중</> : <>녹화상태아님</>}
      {recordedUrl && (
        <video className={styles.resultVideo} src={recordedUrl} controls />
      )}
    </>
  );
};

export default WebcamComponent;
