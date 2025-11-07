import {
  cameraPermission$,
  micPermission$,
} from '@/store/observable/permission';
import { useCallback, useEffect, useState } from 'react';
import { Subscription } from 'rxjs';

export const useMediaPermissions = () => {
  const [cameraPermission, setCameraPermission] = useState<
    PermissionState | 'checking'
  >('checking');
  const [micPermission, setMicPermission] = useState<
    PermissionState | 'checking'
  >('checking');

  useEffect(() => {
    const subs: Subscription[] = [
      cameraPermission$.subscribe(setCameraPermission),
      micPermission$.subscribe(setMicPermission),
    ];

    return () => subs.forEach((sub) => sub.unsubscribe());
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 9999 },
          height: { ideal: 9999 },
        },
        audio: true,
      });

      stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          console.warn('Failed to stop track after getUserMedia');
        }
      });

      setCameraPermission('granted');
      setMicPermission('granted');
    } catch (err) {
      setCameraPermission('denied');
      setMicPermission('denied');
    }
  }, []);

  return { cameraPermission, micPermission, requestPermission };
};
