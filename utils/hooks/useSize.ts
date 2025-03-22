import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

const useSize = <T extends HTMLElement>(ref: RefObject<T>) => {
  const [isResizing, setIsResizing] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleResize = useCallback(() => {
    setIsResizing(true);

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      if (ref.current) {
        setIsResizing(false);
        setSize({
          width: ref.current.clientWidth,
          height: ref.current.clientHeight,
        });
      }
    }, 300);
  }, [ref]);

  useEffect(() => {
    if (!ref.current) return;

    setSize({
      width: ref.current.clientWidth,
      height: ref.current.clientHeight,
    });

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [handleResize, ref]);

  return { size, isResizing };
};

export default useSize;
