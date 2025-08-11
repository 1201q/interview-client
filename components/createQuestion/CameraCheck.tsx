import { VideoOff } from 'lucide-react';
import WebcamInstance from '../refactorWebcam/WebcamInstance';
import styles from './styles/check.module.css';
import { useEffect, useMemo, useRef, useState } from 'react';

import { AnimatePresence, motion, useAnimation } from 'motion/react';

interface CameraCheckProps {
  cameraPermission: PermissionState;
  toggleCameraCheckPhase: (b: boolean) => void;
}

const CameraCheck = (props: CameraCheckProps) => {
  const [isDetecting, setIsDetecting] = useState(false);

  const maskRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const controls = useAnimation();
  const startControls = useAnimation();

  useEffect(() => {
    if (!maskRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });
    observer.observe(maskRef.current);

    return () => observer.disconnect();
  }, []);

  const { cx, cy, r, dash } = useMemo(() => {
    const cx = size.width * 0.5;
    const cy = size.height * 0.4;
    const r = size.width * 0.165;
    return { cx, cy, r, dash: 2 * Math.PI * r };
  }, [size]);

  const startProgress = () => {
    controls.start({
      strokeDashoffset: 0,
      transition: { duration: 5, ease: 'linear' },
    });
  };

  const startDetecting = () => {
    startControls.start({
      strokeDashoffset: dash,
      transition: { duration: 3, ease: 'linear' },
    });
  };

  return (
    <div className={styles.videoContainer} ref={maskRef}>
      {props.cameraPermission === 'granted' && (
        <>
          <WebcamInstance isRunning={true} drawTargets={{}} />
          <AnimatePresence>
            {!isDetecting && (
              <motion.div
                onClick={() => {
                  props.toggleCameraCheckPhase(true);
                  setIsDetecting(true);
                }}
                className={styles.cameraOverlayContainer}
              >
                <h2>클릭시 얼굴 인식을 시작합니다</h2>
                <span>원 안에 얼굴을 위치시키세요.</span>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isDetecting && (
              <>
                <div className={styles.mask}></div>
                {/* <svg
                  className={styles.progressCircle}
                  width="100%"
                  height="100%"
                >
                  <circle className={styles.bg} cx={cx} cy={cy} r={r} />
                  <motion.circle
                    className={styles.fg}
                    cx={cx}
                    cy={cy}
                    r={r}
                    animate={controls}
                    strokeDasharray={dash}
                    initial={{ strokeDashoffset: dash }}
                    transition={{ duration: 5 }}
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: 'center',
                      transformBox: 'fill-box',
                    }}
                  />
                </svg> */}
              </>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isDetecting && (
              <>
                <div
                  className={styles.blurOverlay}
                  style={{
                    width: r * 1.85,
                    height: r * 1.85,
                    left: '50%',
                    top: '40%',
                    transform: 'translate(-50%, -50%)',
                  }}
                ></div>
                <svg
                  className={styles.progressCircle}
                  width="100%"
                  height="100%"
                >
                  <motion.circle
                    className={styles.thinBg}
                    cx={cx}
                    cy={cy}
                    r={r - 2}
                    animate={startControls}
                    strokeDasharray={dash}
                    initial={{ strokeDashoffset: 0 }}
                    transition={{ duration: 3 }}
                    style={{
                      transform: 'rotate(270deg)',
                      transformOrigin: 'center',
                      transformBox: 'fill-box',
                    }}
                  />
                  {/* <motion.circle
                    className={styles.fg}
                    cx={cx}
                    cy={cy}
                    r={r}
                    animate={controls}
                    strokeDasharray={dash}
                    initial={{ strokeDashoffset: dash }}
                    transition={{ duration: 5 }}
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: 'center',
                      transformBox: 'fill-box',
                    }}
                  /> */}
                </svg>
              </>
            )}
          </AnimatePresence>
        </>
      )}
      {props.cameraPermission !== 'granted' && (
        <div className={styles.cameraDeniedContainer}>
          <VideoOff color="var(--font-darkgray-color)" width={50} height={50} />
          {props.cameraPermission === 'denied' && (
            <>
              <span>카메라 접근 권한이 거부되었습니다</span>
              <button>권한 설정 가이드 보기</button>
            </>
          )}
        </div>
      )}
      <button
        onClick={() => startProgress()}
        style={{ position: 'fixed', bottom: 0, zIndex: 100 }}
      >
        시작
      </button>
      <button
        onClick={() => startDetecting()}
        style={{ position: 'fixed', bottom: '10px', left: '50px', zIndex: 100 }}
      >
        con 시작
      </button>
    </div>
  );
};

export default CameraCheck;
