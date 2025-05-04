import Human, { DrawOptions, PersonResult } from '@vladmandic/human';
import { RefObject } from 'react';

interface ResultBuffer {
  timestamp: number;
  data: PersonResult;
}

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

export const useDetectionLoop = (
  human: Human,
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  bufferRef: RefObject<ResultBuffer[]>,
) => {
  const detect = async () => {
    const video = videoRef.current;

    if (video && !video.paused) {
      const result = await human.detect(video);

      bufferRef.current.push({
        timestamp: performance.now(),
        data: result.persons[0],
      });
    }

    requestAnimationFrame(detect);
  };

  const draw = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && !video.paused) {
      const processed = await human.image(video);
      const interpolated = human.next(human.result);

      if (canvas) {
        human.draw.canvas(processed.canvas as HTMLCanvasElement, canvas);
        human.draw.face(canvas, interpolated.face, FACE_DRAW_OPTIONS);
        // human.draw.body(canvas, interpolated.body, DRAW_OPTIONS);
        // human.draw.hand(canvas, interpolated.hand, DRAW_OPTIONS);
      }
    }
    setTimeout(draw, 60);
  };

  const startDetection = () => {
    detect();
    draw();
  };

  return { startDetection };
};
