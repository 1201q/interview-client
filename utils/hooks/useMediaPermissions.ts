import { cameraPermission$, micPermission$ } from '@/store/observable';
import { useEffect, useState } from 'react';
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

  const requestPermission = async () => {
    try {
      const d = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 9999 },
          height: { ideal: 9999 },
        },
        audio: true,
      });

      console.log(d);
    } catch (error) {
      console.log(error);
    }
  };

  return { cameraPermission, micPermission, requestPermission };
};
