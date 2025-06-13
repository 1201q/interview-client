'use client';

import styles from './styles/controller.module.css';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { MicIcon } from 'lucide-react';
import { Camera } from 'lucide-react';
import { CircleCheck } from 'lucide-react';
import { CircleAlert } from 'lucide-react';
import { ShieldCheck, ShieldEllipsis, ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cameraPermission$, micPermission$ } from '@/store/observable';

const Permission = (permission: PermissionState) => {
  if (permission === 'prompt') {
    return <ShieldEllipsis width={16} height={16} />;
  } else if (permission === 'granted') {
    return <ShieldCheck className={styles.green} width={16} height={16} />;
  } else {
    return <ShieldAlert className={styles.red} width={16} height={16} />;
  }
};

const Controller = () => {
  const [cameraPermission, setCameraPermission] =
    useState<PermissionState | null>(null);

  const [micPermission, setMicPermission] = useState<PermissionState | null>(
    null,
  );

  const router = useRouter();
  const param = useParams();
  const id = param.id;

  useEffect(() => {
    const camera = cameraPermission$.subscribe((p) => {
      setCameraPermission(p);
    });

    const mic = micPermission$.subscribe((p) => {
      setMicPermission(p);
    });

    return () => {
      camera.unsubscribe();
      mic.unsubscribe();
    };
  }, []);

  return (
    <motion.div className={styles.container}>
      <div className={styles.boxWrapper}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={styles.boxContainer}
        >
          <div className={styles.titleContainer}>
            <p>권한 상태</p>
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.info}>
              <div className={styles.infoLeft}>
                <Camera width={16} height={16} strokeWidth={2} />
                <p>카메라</p>
              </div>
              {cameraPermission && Permission(cameraPermission)}
            </div>
            <div className={styles.info}>
              <div className={styles.infoLeft}>
                <MicIcon width={16} height={16} strokeWidth={2} />
                <p>마이크</p>
              </div>

              {micPermission && Permission(micPermission)}
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className={styles.boxContainer}
        >
          <div className={styles.titleContainer}>
            <p>디바이스 체크 상태</p>
            <span>디바이스 체크를 통과하면 면접을 진행합니다.</span>
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.info}>
              <div className={styles.infoLeft}>
                <Camera width={16} height={16} strokeWidth={2} />
                <p>카메라 체크</p>
              </div>
              <CircleCheck width={16} height={16} />
            </div>
            <div className={styles.info}>
              <div className={styles.infoLeft}>
                <MicIcon width={16} height={16} strokeWidth={2} />
                <p>마이크 체크</p>
              </div>

              <CircleAlert width={16} height={16} />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button
              disabled={false}
              onClick={() => {
                router.push(`/new/check/${id}`);
              }}
            >
              면접 시작
            </button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={styles.boxContainer}
        >
          <div className={styles.titleContainer}>
            <span className={styles.smallTtitle}>문제가 있어요</span>
          </div>
          <div className={styles.listTextContainer}>
            <p>
              • 카메라/마이크 권한이 거부된 경우 브라우저 설정에서 권한을
              허용해주세요.
            </p>
            <p>
              • 다른 앱에서 카메라/마이크를 사용 중이면 종료 후 다시
              시도해주세요.
            </p>
            <p>• 페이지를 새로고침하면 권한을 다시 요청할 수 있어요.</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Controller;
