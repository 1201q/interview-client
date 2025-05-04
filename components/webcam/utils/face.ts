import { PersonResult } from '@vladmandic/human';

import { DirectionType } from '@/utils/types/types';

export const isFacingCenter = (data: PersonResult) => {
  const lastGesture = data?.gestures || [];
  const faceData = lastGesture.filter((g) => 'face' in g).map((g) => g.gesture);
  const irisData = lastGesture.filter((g) => 'iris' in g).map((g) => g.gesture);

  let faceDirection: DirectionType | null = null;
  let irisDirection: DirectionType | null = null;

  if (faceData.includes('facing center')) {
    if (faceData.includes('head up')) {
      faceDirection = 'up';
    } else if (faceData.includes('head down')) {
      faceDirection = 'down';
    } else {
      faceDirection = 'center';
    }
  } else if (faceData.includes('facing left')) {
    faceDirection = 'right';
  } else if (faceData.includes('facing right')) {
    faceDirection = 'left';
  }

  if (irisData.includes('facing center')) {
    if (irisData.includes('looking center')) {
      irisDirection = 'center';
    } else if (irisData.includes('looking down')) {
      if (faceDirection === 'down') {
        irisDirection = 'down';
      } else if (faceDirection === 'center') {
        irisDirection = 'center';
      }
    } else if (irisData.includes('looking up')) {
      irisDirection = 'up';
    } else if (irisData.includes('looking left')) {
      irisDirection = 'right';
    } else if (irisData.includes('looking right')) {
      irisDirection = 'left';
    }
  } else {
    if (irisData.includes('looking down')) {
      irisDirection = 'down';
    } else if (irisData.includes('looking up')) {
      irisDirection = 'up';
    } else if (irisData.includes('looking left')) {
      irisDirection = 'left';
    } else if (irisData.includes('looking right')) {
      irisDirection = 'right';
    }
  }

  if (faceDirection === 'center') {
    if (irisDirection === 'center') {
      return true;
    } else if (!irisDirection) {
      return true;
    } else {
      // console.log(faceData, irisData);
      return false;
    }
  } else {
    // console.log(faceData, irisData);
    return false;
  }
};
