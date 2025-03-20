'use client';

import { useEffect, useState } from 'react';
import { RefObject } from 'react';
import type { Human, Config, Result } from '@vladmandic/human';

const config: Partial<Config> = {
  debug: true,
  modelBasePath: 'https://vladmandic.github.io/human/models/',
  face: { enabled: true },
};

interface Props {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

const HumanDetector = ({ videoRef, canvasRef }: Props) => {
  const [human, setHuman] = useState<Human | null>(null);
  const [isReady, setIsReady] = useState(false);

  let result: Result;

  useEffect(() => {
    loadHuman();
  }, []);

  const loadHuman = async () => {
    if (typeof window !== 'undefined') {
      const Library = await import('@vladmandic/human');
      const humanInstance = new Library.default(config) as Human;
      await humanInstance.load();

      setHuman(humanInstance);
      setIsReady(true);

      console.log('Human 모델 로드 완료');
    }
  };

  const detect = async () => {
    if (!human || !videoRef.current) return;

    console.log('얼굴 감지 중...');
    result = await human.detect(videoRef.current);
    drawResult();
    requestAnimationFrame(detect);
  };

  const drawResult = () => {
    if (result && human) {
      const interpolated = human.next(result);

      if (videoRef.current && canvasRef.current) {
        // human.draw.canvas(videoRef.current, canvasRef.current);
        // human.draw.face(canvasRef.current, interpolated.face);
        // human.draw.all(canvasRef.current, interpolated);
      }
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          detect();
          drawResult();
        }}
        disabled={!isReady}
      >
        얼굴 감지 시작
      </button>
    </div>
  );
};

export default HumanDetector;
