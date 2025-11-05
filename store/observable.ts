import { Observable } from 'rxjs';

// 권한
// 권한을 감시
const subscribePermission = (
  name: PermissionName,
): Observable<PermissionState> => {
  return new Observable<PermissionState>((observer) => {
    navigator.permissions
      ?.query({ name })
      .then((status) => {
        observer.next(status.state);

        const handleChange = () => observer.next(status.state);
        status.addEventListener('change', handleChange);

        return () => status.removeEventListener('change', handleChange);
      })
      .catch(() => {
        observer.next('prompt');
        observer.complete();
      });
  });
};

export const cameraPermission$ = subscribePermission('camera');
export const micPermission$ = subscribePermission('microphone');
