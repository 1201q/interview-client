import { useEffect, useRef, useState } from 'react';
import { isFacingCenter } from './utils/face';

export const useFaceCenter = (isRunning: boolean, bufferRef: any) => {
  const [isCenter, setIsCenter] = useState(true);

  const lastNotCenterTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const data = bufferRef.current.at(-1)?.data;
      if (!data) return;

      const facingCenter = isFacingCenter(data);
      const now = Date.now();

      if (facingCenter) {
        // console.log('센터입니다.');

        lastNotCenterTimeRef.current = null;
        setIsCenter(true);
      } else {
        if (lastNotCenterTimeRef.current === null) {
          // console.log(`센터가 아님: ${now}`);
          lastNotCenterTimeRef.current = now;
        } else {
          const elasped = now - lastNotCenterTimeRef.current;
          if (elasped > 300) {
            // console.log(`센터가 아닌지 0.3초 이상 경과`);
            setIsCenter(false);
          }
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning]);

  return isCenter;
};
