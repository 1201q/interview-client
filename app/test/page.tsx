'use client';
import WebcamInstance from '@/components/refactorWebcam/WebcamInstance';
import { initHumanAtom } from '@/store/webcam';
import { useAtomValue } from 'jotai';

const Page = () => {
  useAtomValue(initHumanAtom);
  return (
    <div style={{ position: 'relative', height: '600px', width: '1200px' }}>
      <WebcamInstance isRunning={true} drawTargets={{ face: true }} />
    </div>
  );
};

export default Page;
