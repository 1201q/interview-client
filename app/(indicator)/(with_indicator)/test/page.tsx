'use client';

import WebcamInstance from '@/components/refactorWebcam/WebcamInstance';
import {
  distinctFaceDetected$,
  isLookingCenter$,
  isFaceOrIrisCenter$,
  faceCenterCheck$,
} from '@/store/observable';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const TestPage = () => {
  const [on, setOn] = useState(false);

  const [isDetected, setIsDetected] = useState(false);

  useEffect(() => {
    const sub = isLookingCenter$.subscribe((value) => {
      console.log(value);
    });

    const sub2 = faceCenterCheck$.subscribe((value) => {
      if (value) {
        console.log('5초동안 얼굴이 중간에 있음');
      } else {
        console.log('5초동안 얼굴이 중간에 없음');
      }
    });

    return () => {
      sub.unsubscribe();
      sub2.unsubscribe();
    };
  }, []);

  return (
    <>
      <WebcamInstance isRunning={on} />
      <div style={{ position: 'fixed', top: 0, zIndex: 100 }}>
        <Link href={'/test/test'}>뭐하냐</Link>
        <button onClick={() => setOn((prev) => !prev)}>버튼</button>
      </div>
    </>
  );
};

export default TestPage;
