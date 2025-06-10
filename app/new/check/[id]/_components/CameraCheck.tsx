import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles/check.module.css';
import { CameraOff } from 'lucide-react';
import { cameraPermission$, isFaceInCircleWarning$ } from '@/store/observable';

import { UserRoundCheck } from 'lucide-react';

import { AnimatePresence, motion, useAnimation } from 'motion/react';
import WebcamInstance from '@/components/refactorWebcam/WebcamInstance';

import { SquareUserRound } from 'lucide-react';
import { Mouse } from 'lucide-react';

const CameraCheck = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [cameraPermission, setCameraPermission] =
    useState<PermissionState | null>(null);

  const [cameraCheckStart, setCameraCheckStart] = useState(false);
  const [cameraGuide, setCameraGuide] = useState(true);

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [progressRunning, setProgressRunning] = useState(false);
  const controls = useAnimation();

  const { r, cx, cy, dash } = useMemo(() => {
    const r = 120;
    const cx = size.width * 0.5;
    const cy = size.height * 0.4;
    return { r, cx, cy, dash: 2 * Math.PI * r };
  }, [size]);

  useEffect(() => {
    if (!ref.current) return;
    if (!cameraCheckStart) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [cameraCheckStart]);

  useEffect(() => {
    const camera = cameraPermission$.subscribe((p) => {
      setCameraPermission(p);
    });

    const subs = isFaceInCircleWarning$.subscribe((s) => {
      if (s) {
        startProgress();
      } else {
        pauseProgress();
        resetProgress();
      }
    });

    return () => {
      subs.unsubscribe();
      camera.unsubscribe();
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      const status = await navigator.permissions.query({
        name: 'camera' as PermissionName,
      });

      if (status.state === 'granted' || status.state === 'denied') {
        return status.state;
      }

      await navigator.mediaDevices.getUserMedia({
        video: { width: 1920, height: 1080 },
      });
      return status.state;
    } catch (error) {
      return 'denied';
    }
  };

  const startProgress = () => {
    controls.start({
      strokeDashoffset: 0,
      transition: { duration: 5, ease: 'linear' },
    });
    setProgressRunning(true);
  };

  const pauseProgress = () => {
    controls.stop();
    setProgressRunning(false);
  };

  const resetProgress = () => {
    controls.set({ strokeDashoffset: dash });
    setProgressRunning(false);
  };

  return (
    <div
      className={`${styles.cameraContainer} ${cameraPermission === 'granted' ? styles.black : ''}`}
    >
      {cameraPermission && cameraPermission !== 'granted' && (
        <div className={styles.noPermissionContainer}>
          {cameraPermission === 'prompt' && (
            <>
              <CameraOff width={40} height={40} />
              <p>아래 버튼을 눌러 카메라 권한을 허용해주세요</p>
            </>
          )}
          {cameraPermission === 'denied' && (
            <>
              <CameraOff width={40} height={40} />
              <p>카메라 권한을 거부하셨습니다</p>
              <p>브라우저 설정에서 직접 허용해주세요</p>
            </>
          )}

          {cameraPermission === 'prompt' && (
            <div className={styles.requestPermissionContainer}>
              <button
                onClick={() => requestCameraPermission()}
                className={styles.requestPermissionButton}
              >
                <UserRoundCheck width={23} height={23} />
                <p>카메라 권한 요청</p>
              </button>
            </div>
          )}
        </div>
      )}

      {cameraPermission === 'granted' && (
        <>
          {cameraCheckStart && (
            <>
              <div ref={ref} className={styles.mask}></div>
              <WebcamInstance isRunning={true} />
            </>
          )}
          {cameraCheckStart && !cameraGuide && (
            <svg className={styles.progressCircle} width="100%" height="100%">
              <circle className={styles.bg} cx={cx} cy={cy} r={r} />
              <motion.circle
                className={styles.fg}
                cx={cx}
                cy={cy}
                r={r}
                strokeDasharray={dash}
                animate={controls}
                initial={{ strokeDashoffset: dash }}
                transition={{ duration: 5, ease: 'easeIn' }}
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: 'center',
                  transformBox: 'fill-box',
                }}
                onAnimationEnd={() => {
                  console.log('wowwowwo');
                }}
              />
            </svg>
          )}
          <AnimatePresence>
            {cameraCheckStart && !cameraGuide && (
              <motion.div className={styles.guideTextContainer}>
                <motion.p layoutId="text1">5초간 정면을 바라보면서</motion.p>
                <motion.p layoutId="text">
                  얼굴을 가운데 원에 맞춰주세요
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {cameraCheckStart && cameraGuide && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCameraCheckStart(true)}
                className={styles.beforeCameraCheck}
              >
                <SquareUserRound
                  className={styles.maskImage}
                  width={100}
                  height={100}
                  color="gray"
                  strokeWidth={1}
                />
                <motion.div className={styles.textContainer}>
                  <motion.span
                    layoutId="text1"
                    className={styles.gradientText}
                    initial={{ backgroundPosition: '100% 0%' }}
                    animate={{ backgroundPosition: '0% 0%' }}
                    transition={{ duration: 1, ease: 'easeIn' }}
                  >
                    내 얼굴이 보이면
                  </motion.span>
                  <motion.p
                    layoutId="text"
                    className={styles.gradientText}
                    initial={{ backgroundPosition: '100% 0%' }}
                    animate={{ backgroundPosition: '0% 0%' }}
                    transition={{ delay: 1, duration: 2, ease: 'easeIn' }}
                    onAnimationComplete={() => {
                      setTimeout(() => {
                        setCameraGuide(false);
                      }, 2000);
                    }}
                  >
                    얼굴을 가운데 원에 맞춰주세요
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {!cameraCheckStart && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setCameraCheckStart(true)}
              className={styles.beforeCameraCheck}
            >
              <Mouse
                color="darkgray"
                className={styles.maskImage}
                width={90}
                height={90}
                strokeWidth={1.3}
              />
              <div className={styles.textContainer}>
                <p>클릭하면</p>
                <p>얼굴 인식으로 이동해요</p>
              </div>
            </motion.div>
          )}
        </>
      )}
      <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 10 }}>
        <button onClick={startProgress}>시작</button>
        <button onClick={pauseProgress}>중지</button>
        <button onClick={resetProgress}>되돌리기</button>
      </div>
    </div>
  );
};

export default CameraCheck;
