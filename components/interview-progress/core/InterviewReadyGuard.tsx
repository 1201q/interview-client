'use client';

import { useEffect, useRef } from 'react';
import { useSetAtom } from 'jotai';
import { isInterviewReadyAtom } from '@/store/interview';
import { useMediaPermissions } from '@/utils/hooks/useMediaPermissions';
import { useAtomValue } from 'jotai';
import { isHumanLoadedAtom } from '@/store/webcam';

export default function InterviewReadyGuard() {
  const { cameraPermission, micPermission } = useMediaPermissions();
  const isHumanLoaded = useAtomValue(isHumanLoadedAtom);
  const setInterviewReady = useSetAtom(isInterviewReadyAtom);

  const allGranted =
    cameraPermission === 'granted' && micPermission === 'granted';

  const allReady = allGranted && isHumanLoaded;

  const prev = useRef<boolean | null>(null);

  useEffect(() => {
    if (prev.current !== allReady) {
      setInterviewReady(allReady);
      prev.current = allReady;
    }
  }, [allReady, setInterviewReady]);

  return null;
}
