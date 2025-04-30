import { useEffect, useState } from 'react';

type PermissionType = 'camera' | 'microphone';

export const usePermissonCheck = (type: PermissionType) => {
  const [granted, setGranted] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPermission = async () => {
      if (!navigator.permissions || !navigator.mediaDevices) {
        console.warn('Permissions API 또는 MediaDevices API 미지원');
        setGranted(false);
        return;
      }

      try {
        const result = await navigator.permissions.query({
          name: type as PermissionName,
        });
        setGranted(result.state === 'granted');

        result.onchange = () => {
          setGranted(result.state === 'granted');
        };
      } catch (err) {
        console.error('권한 확인 실패:', err);
        setGranted(false);
      }
    };

    checkPermission();
  }, []);

  return granted;
};
