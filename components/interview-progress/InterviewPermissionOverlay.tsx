'use client';

import { useAtomValue } from 'jotai';

import styles from './styles/i.overlay.module.css';
import { useMediaPermissions } from '@/utils/hooks/useMediaPermissions';
import { isHumanLoadedAtom } from '@/store/webcam';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const InterviewPermissionOverlay = () => {
  const router = useRouter();

  const { cameraPermission, micPermission, requestPermission } =
    useMediaPermissions();

  const allGranted =
    cameraPermission === 'granted' && micPermission === 'granted';

  const existsDenied =
    cameraPermission === 'denied' || micPermission === 'denied';

  const isHumanLoaded = useAtomValue(isHumanLoadedAtom);

  if (allGranted && isHumanLoaded) {
    return null;
  }

  if (allGranted && !isHumanLoaded) {
    return (
      <div className={styles.bg}>
        <div className={styles.loaderContents}>
          <div className={styles.loader}>
            <Loader2 />
          </div>
        </div>
      </div>
    );
  }

  if (existsDenied) {
    return (
      <div className={styles.bg}>
        <div className={styles.contents}>
          <h2>권한 거부됨</h2>
          <span>
            해당 서비스는 <strong>카메라와 마이크 권한</strong>을 요구합니다.
          </span>
          <span>
            브라우저 설정에서 카메라와 마이크 권한에 <strong>허용</strong>을
            눌러주세요.
          </span>

          <div className={styles.statuses}>
            <div className={styles.statusItem}>
              <span>카메라</span>
              <span className={styles.statusRight}>
                {cameraPermission === 'prompt' && <Loader2 />}
                {cameraPermission === 'denied' && <span>거부됨</span>}
              </span>
            </div>
            <div className={styles.statusItem}>
              <span>마이크</span>
              <span className={styles.statusRight}>
                {cameraPermission === 'granted' &&
                  micPermission === 'prompt' && (
                    <button onClick={() => requestPermission()}>
                      권한 요청
                    </button>
                  )}
                {micPermission === 'denied' && <span>거부됨</span>}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bg}>
      <div className={styles.contents}>
        <h2>권한 요청</h2>
        <span>
          해당 서비스는 <strong>카메라와 마이크 권한</strong>을 요구합니다.
        </span>
        <span>
          권한 요구창이 나타나면 <strong>허용</strong>을 눌러주세요.
        </span>

        <div className={styles.statuses}>
          <div className={styles.statusItem}>
            <span>카메라</span>
            <span className={styles.statusRight}>
              {cameraPermission === 'prompt' && <Loader2 />}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span>마이크</span>
            <span className={styles.statusRight}>
              {cameraPermission === 'granted' && micPermission === 'prompt' && (
                <button
                  onClick={() => {
                    requestPermission().then(() => {
                      router.refresh();
                    });
                  }}
                >
                  권한 요청
                </button>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPermissionOverlay;
