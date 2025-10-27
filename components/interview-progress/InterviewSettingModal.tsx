'use client';

import { useEffect, useRef, useState } from 'react';
import { useInterview } from './InterviewProvider';
import styles from './styles/i.modal.module.css';

import { AnimatePresence, motion } from 'motion/react';

import { ChevronDown } from 'lucide-react';

const InterviewSettingModal = (
  props: ReturnType<typeof useInterview> & { onClose: () => void },
) => {
  const [openCameraDropdown, setOpenCameraDropdown] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);

  const handleBackgroundClick = (e: MouseEvent) => {
    if (bgRef.current && bgRef.current === e.target) {
      props.onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleBackgroundClick);
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';

      document.removeEventListener('mousedown', handleBackgroundClick);
    };
  }, []);

  return (
    <div className={styles.bg} ref={bgRef}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className={styles.modal}
        transition={{
          type: 'spring',
          stiffness: 420,
          damping: 30,
        }}
      >
        <div className={styles.modalmenu}>
          <p className={styles.title}>카메라 옵션</p>
          <div
            itemType="button"
            className={styles.dropdown}
            onClick={() => setOpenCameraDropdown((prev) => !prev)}
          >
            <span>{props.cameraObjectFitOpt}</span>
            <motion.span
              style={{ display: 'flex' }}
              animate={{ rotate: openCameraDropdown ? 180 : 0 }}
            >
              <ChevronDown size={15} />
            </motion.span>

            <AnimatePresence>
              {openCameraDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={styles.dropdownMenu}
                >
                  <button
                    className={`${styles.dropdownMenuItem} ${props.cameraObjectFitOpt === 'cover' ? styles.selected : ''}`}
                    onClick={() => {
                      if (props.cameraObjectFitOpt === 'cover') return;
                      props.toggleCameraObjectFit();
                    }}
                  >
                    cover
                  </button>
                  <button
                    className={`${styles.dropdownMenuItem} ${props.cameraObjectFitOpt === 'contain' ? styles.selected : ''}`}
                    onClick={() => {
                      if (props.cameraObjectFitOpt === 'contain') return;
                      props.toggleCameraObjectFit();
                    }}
                  >
                    contain
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const DropDownMenu = () => {
  return (
    <div className={styles.dropdownMenu}>
      <button className={styles.dropdownMenuItem}>옵션1</button>
      <button className={styles.dropdownMenuItem}>옵션2</button>
    </div>
  );
};

export default InterviewSettingModal;
