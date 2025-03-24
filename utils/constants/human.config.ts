import type { Config } from '@vladmandic/human';

// https://github.com/vladmandic/human/discussions/252

export const humanConfig: Partial<Config> = {
  debug: true,
  modelBasePath: 'https://cdn.jsdelivr.net/gh/vladmandic/human-models/models/',
  face: {
    enabled: true,
    skipFrames: 50,
    iris: { enabled: false },
    description: { enabled: false },
    liveness: { enabled: false },
    detector: { enabled: false, scale: 1.4 },
  },
  body: { enabled: false },
  hand: { enabled: false },
  object: { enabled: false },
  segmentation: { enabled: false },
  gesture: { enabled: true },
  filter: { enabled: false, flip: true },
};
