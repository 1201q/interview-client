'use client';

import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';

import { webcamStreamAtom } from '@/store/webcam';
import styles from './webcam.module.css';

const GlobalVideoBg = () => {
  const stream = useAtomValue(webcamStreamAtom);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;

    if (!video) return;

    if (stream) {
      video.srcObject = stream;

      video.play().then(() => {
        video.pause();
      });
    } else {
      video.pause();
      video.srcObject = null;
    }

    return () => {
      video.pause();
      video.srcObject = null;
    };
  }, [stream]);

  return (
    <video
      ref={ref}
      className={styles.bgVideoFixed}
      muted
      playsInline
      aria-hidden
    />
  );
};

export default GlobalVideoBg;
