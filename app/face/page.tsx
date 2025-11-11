'use client';

import WebcamInstance from '@/components/human-webcam/WebcamInstance';
import { answerEnd$, answerStart$ } from '@/store/observable/raw';
import { recordedFaceData$ } from '@/store/observable/result';

import React, { useEffect } from 'react';

const Page = () => {
  const [cameraOn, setCameraOn] = React.useState(true);

  useEffect(() => {
    const sub = recordedFaceData$.subscribe((s) => {
      const aa = s.map((q) => ({
        ...q,
        timestamp: new Date(q.timestamp),
      }));

      console.log(aa);
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return (
    <>
      <div style={{ width: '500px', height: '300px', position: 'relative' }}>
        <WebcamInstance isRunning={cameraOn} drawTargets={{ face: true }} />
        <button
          style={{ position: 'fixed', top: 0, right: 0 }}
          onClick={() => {
            setCameraOn((prev) => !prev);
          }}
        >
          중지
        </button>
      </div>
      <button
        onClick={() => {
          answerStart$.next();
        }}
      >
        시작
      </button>
      <button
        onClick={() => {
          answerEnd$.next();
        }}
      >
        종료
      </button>
    </>
  );
};

export default Page;
