import { PersonResult } from '@vladmandic/human';

export const isFacingCenter = (data: PersonResult) => {
  const lastGesture = data?.gestures || [];
  const faceData = lastGesture.filter((g) => 'face' in g);
  const mouthData = faceData.filter((g) => g.gesture.includes('mouth'));

  const irisData = lastGesture.filter((g) => 'iris' in g);

  // facing center
  const facingCenter = faceData.some((g) => g.gesture === 'facing center');

  // head가 포함되면 위아래, 왼쪽 오른쪽으로 얼굴이 위치함. (정면을 바라보고 있지 않음)
  const headDataExists = faceData.some((g) => g.gesture.includes('head'));

  return facingCenter && !headDataExists;
};
