import { GestureResult } from '@vladmandic/human';

export const isFaceOrIrisCenter = (results: GestureResult[]) => {
  const filtered = results.filter((g) => 'face' in g || 'iris' in g);

  const centers = filtered.filter((g) => g.gesture.includes('center'));

  return centers.length >= 2;
};
