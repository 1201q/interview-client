import type { Config } from '@vladmandic/human';

// https://github.com/vladmandic/human/discussions/252

// export const humanConfig: Partial<Config> = {
//   debug: false,
//   modelBasePath: 'https://cdn.jsdelivr.net/gh/vladmandic/human-models/models/',
//   face: {
//     enabled: true,
//     skipFrames: 1000,
//     iris: { enabled: true },
//     description: { enabled: false },
//     liveness: { enabled: false },
//     emotion: { enabled: false },
//     detector: { enabled: false, scale: 1.4 },
//   },
//   body: { enabled: true },
//   hand: { enabled: false },
//   gesture: { enabled: true },
//   segmentation: { enabled: false },
//   object: { enabled: false },
//   filter: { enabled: false, flip: true },
// };

export const humanConfig: Partial<Config> = {
  debug: false,
  modelBasePath: 'https://cdn.jsdelivr.net/gh/vladmandic/human-models/models/',
  face: {
    enabled: true,
    skipFrames: 1000,

    detector: { enabled: true, maxDetected: 1, minSize: 256, scale: 1.4 },
    mesh: { enabled: true },
    iris: { enabled: true },
    description: { enabled: false },
    liveness: { enabled: false },
    emotion: {
      enabled: true,
      modelPath: 'affectnet-mobilenet.json',
      skipTime: 500,
    },
  },
  body: { enabled: false },
  hand: { enabled: false },
  gesture: { enabled: true },
  segmentation: { enabled: false },
  object: { enabled: false },
  filter: { enabled: false, flip: true },
};
