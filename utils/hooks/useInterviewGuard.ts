import { useCallback, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import {
  guardPhaseAtom,
  guardReasonAtom,
  type GuardPhase,
  type Reason,
} from '@/store/permissions';

const supportPermissions = () =>
  typeof navigator !== 'undefined' && 'permissions' in navigator;

export const useInterviewGuard = () => {
  const setPhase = useSetAtom(guardPhaseAtom);
  const setReason = useSetAtom(guardReasonAtom);

  const set = useCallback(
    (p: GuardPhase, r: Reason = null) => {
      setPhase(p);
      setReason(r);
    },
    [setPhase, setReason],
  );

  const check = useCallback(async () => {
    set('loading');

    try {
      // ok
      if (supportPermissions()) {
        const cam = await navigator.permissions.query({ name: 'camera' });

        const mic = await navigator.permissions.query({ name: 'microphone' });

        const camGranted = cam.state === 'granted';
        const micGranted = mic.state === 'granted';

        if (!camGranted || !micGranted) {
          set('need-permission');

          return false;
        }
      }

      set('ready');
      return true;
    } catch {
      set('ready');
      return true;
    }
  }, [set]);

  // 권한 요청
  const requestPermission = useCallback(async () => {
    set('requesting');

    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      set('ready');
    } catch (error: any) {
      const name = error?.name ?? '';

      if (name === 'NotAllowedError' || name === 'SecurityError') {
        set('need-permission', 'permissions-revoked');
      } else {
        set('error', 'unknown');
      }
      return false;
    }
  }, [set]);

  // 장치 변경 감지함.
  useEffect(() => {
    const onDeviceChange = () => set('degraded', 'device-lost');

    navigator.mediaDevices.addEventListener('devicechange', onDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener(
        'devicechange',
        onDeviceChange,
      );
    };
  }, [set]);

  useEffect(() => {
    if (!supportPermissions()) return;

    const unsubs: Array<() => void> = [];

    (async () => {
      try {
        const cam = await navigator.permissions.query({ name: 'camera' });

        const mic = await navigator.permissions.query({ name: 'microphone' });

        const bind = (perm: PermissionStatus) => {
          const onChange = () => {
            if (perm.state === 'denied') {
              set('revoked', 'permissions-revoked');
            } else if (perm.state === 'granted') {
              set('ready');
            } else {
              set('degraded');
            }
          };

          perm.addEventListener('change', onChange);
          unsubs.push(() => perm.removeEventListener('change', onChange));
        };

        bind(cam);
        bind(mic);
      } catch (error) {
        console.error('Failed to bind permission change events', error);
      }
    })();

    return () => {
      unsubs.forEach((fn) => fn());
    };
  }, [set]);

  return { check, requestPermission };
};
