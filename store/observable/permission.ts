import { Observable } from 'rxjs';

// 권한
// 권한을 감시
const subscribePermission = (
  name: PermissionName,
): Observable<PermissionState> => {
  return new Observable<PermissionState>((observer) => {
    if (!navigator.permissions) {
      observer.next('prompt');
      observer.complete();
      return;
    }

    let status: PermissionStatus | null = null;
    let handleChange: (() => void) | null = null;

    navigator.permissions
      .query({ name })
      .then((s) => {
        status = s;
        observer.next(s.state);

        handleChange = () => observer.next(s.state);
        s.addEventListener('change', handleChange);
      })
      .catch(() => {
        observer.next('prompt');
        observer.complete();
      });

    return () => {
      if (status && handleChange) {
        status.removeEventListener('change', handleChange);
      }
    };
  });
};

export const cameraPermission$ = subscribePermission('camera');
export const micPermission$ = subscribePermission('microphone');
