'use client';

import { Loader2, ShieldCheck } from 'lucide-react';
import styles from './styles/i.gate.module.css';
import { AnimatePresence, motion } from 'motion/react';
import { useMediaPermissions } from '@/utils/hooks/useMediaPermissions';
import { useAtom, useAtomValue } from 'jotai';
import { initHumanAtom, isHumanLoadedAtom } from '@/store/webcam';
import { isInterviewReadyAtom } from '@/store/interview';
import { useState } from 'react';

const InterviewGateOverlay = () => {
  const { cameraPermission, micPermission, requestPermission } =
    useMediaPermissions();

  const [buttonLoading, setButtonLoading] = useState(false);
  const isHumanLoaded = useAtomValue(isHumanLoadedAtom);
  const [interviewReady] = useAtom(isInterviewReadyAtom);

  if (interviewReady) return null;

  const allGranted =
    cameraPermission === 'granted' && micPermission === 'granted';

  const permissionsDenied =
    cameraPermission === 'denied' || micPermission === 'denied';

  return (
    <motion.div
      key="gate-overlay"
      className={styles.main}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
    >
      <AnimatePresence mode="wait">
        {allGranted && !isHumanLoaded ? (
          <motion.div
            key={'human-loading'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HumanLoading />
          </motion.div>
        ) : (
          <motion.div
            key={'permission-request'}
            className={styles.contents}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              카메라와 마이크 권한이 필요합니다
            </motion.h1>
            {permissionsDenied ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.6,
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className={styles.progress}
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.9,
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {'카메라와 마이크 권한을 거부하셨습니다.'}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 1.2,
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {'브라우저 설정에서 다시 권한을 허용해주세요.'}
                </motion.span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className={styles.progress}
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.4,
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {'서비스 사용에 카메라와 마이크 권한이 필요합니다.'}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.5,
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {'권한 요청을 누르고 권한을 허용해주세요.'}
                </motion.span>

                <motion.div
                  className={styles.buttons}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: 1.2,
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <motion.button
                    disabled={buttonLoading}
                    className={styles.requestPermissionButton}
                    onClick={() => {
                      setButtonLoading(true);
                      requestPermission().finally(() =>
                        setButtonLoading(false),
                      );
                    }}
                  >
                    <ShieldCheck />
                    <span>
                      {buttonLoading
                        ? '권한을 확인하는 중...'
                        : '권한 요청하기'}
                    </span>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const HumanLoading = () => {
  useAtomValue(initHumanAtom);

  return (
    <div className={styles.loaderWrapper}>
      <motion.div
        className={styles.loader}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 size={70} />
      </motion.div>
    </div>
  );
};
export default InterviewGateOverlay;
