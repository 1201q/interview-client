import type { Config } from '@vladmandic/human';
import { DirectionType } from '../types/types';

// https://github.com/vladmandic/human/discussions/252

export const humanConfig: Partial<Config> = {
  debug: false,
  modelBasePath: 'https://cdn.jsdelivr.net/gh/vladmandic/human-models/models/',
  face: {
    enabled: true,
    skipFrames: 1000,
    iris: { enabled: true },
    description: { enabled: false },
    liveness: { enabled: false },
    emotion: { enabled: false },
    detector: { enabled: false, scale: 1.4 },
  },
  body: { enabled: true },
  hand: { enabled: false },
  gesture: { enabled: true },
  segmentation: { enabled: false },
  object: { enabled: false },
  filter: { enabled: false, flip: true },
};

export const feceResultStatus: { type: DirectionType; text: string }[] = [
  {
    type: 'center',
    text: '머리의 방향이 정면입니다.',
  },
  {
    type: 'left',
    text: '머리의 방향이 🠔 방향입니다.',
  },
  {
    type: 'right',
    text: '머리의 방향이 🠖 방향입니다.',
  },
  {
    type: 'down',
    text: '머리의 방향이 🠗 방향입니다.',
  },
  {
    type: 'up',
    text: '머리의 방향이 🠕 방향입니다.',
  },
];

export const irisResultStatus: { type: DirectionType; text: string }[] = [
  { type: 'center', text: '시선의 방향이 정면입니다.' },
  { type: 'left', text: '시선의 방향이 🠔 방향입니다.' },
  {
    type: 'right',
    text: '시선의 방향이 🠖 방향입니다.',
  },
  {
    type: 'down',
    text: '시선의 방향이 🠗 방향입니다.',
  },
  {
    type: 'up',
    text: '시선의 방향이 🠕 방향입니다.',
  },
];
