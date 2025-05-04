import Human, { DrawOptions } from '@vladmandic/human';
import { RefObject, useRef } from 'react';

interface DrawTargets {
  face?: boolean;
  body?: boolean;
  hand?: boolean;
}

const DRAW_OPTIONS: Partial<DrawOptions> = {
  drawPolygons: false,
  drawLabels: false,
  drawBoxes: false,
};

const FACE_DRAW_OPTIONS: Partial<DrawOptions> = {
  drawGaze: false,
  drawLabels: true,
  drawPolygons: false,
  drawGestures: true,
  faceLabels: `[score]%
  [distance]
  roll: [roll]° yaw:[yaw]° pitch:[pitch]°
`,
};

export const useDrawLoop = (
  human: Human,
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
) => {
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const optionsRef = useRef<DrawTargets>({});

  const draw = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const options = optionsRef.current;

    if (video && !video.paused) {
      const processed = await human.image(video);
      const interpolated = human.next(human.result);

      if (canvas) {
        human.draw.canvas(processed.canvas as HTMLCanvasElement, canvas);

        if (options.face) {
          human.draw.face(canvas, interpolated.face, FACE_DRAW_OPTIONS);
        }

        if (options.body) {
          human.draw.body(canvas, interpolated.body, DRAW_OPTIONS);
        }

        if (options.hand) {
          human.draw.hand(canvas, interpolated.hand, DRAW_OPTIONS);
        }
      }
    }
    timeoutRef.current = setTimeout(draw, 20);
  };

  const startDrawing = (options: DrawTargets = {}) => {
    console.log('1. draw를 시작합니다.');
    optionsRef.current = options;
    draw();
  };

  const updateOptions = (newOptions: Partial<DrawTargets>) => {
    optionsRef.current = { ...optionsRef.current, ...newOptions };
  };

  const stopDrawing = () => {
    if (timeoutRef.current) {
      console.log('1. draw를 중지합니다.');
      clearTimeout(timeoutRef.current);
    }
  };

  return { startDrawing, stopDrawing, updateOptions };
};
