'use client';

import { useState } from 'react';
import CameraInstructions from './_components/CameraInstructions';
import MicInstructions from './_components/MicInstructions';
import { AnimatePresence, motion } from 'motion/react';
import PermissionCheck from './_components/PermissionCheck';
import CameraTest from './_components/CameraTest';
import MicTest from './_components/MicTest';

const STEP = [
  '카메라안내',
  '마이크안내',
  '권한체크',
  '카메라테스트',
  '마이크테스트',
];

const DeviceCheckPage = () => {
  const [step, setStep] = useState(STEP[0]);

  return (
    <>
      <AnimatePresence>
        {step === '카메라안내' && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CameraInstructions
              nextStep={() => {
                setStep('마이크안내');
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {step === '마이크안내' && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MicInstructions
              nextStep={() => {
                setStep('권한체크');
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {step === '권한체크' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: 120 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <PermissionCheck nextStep={() => setStep('마이크테스트')} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step === '마이크테스트' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: 120 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <MicTest nextStep={() => setStep('카메라테스트')} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step === '카메라테스트' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: 120 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <CameraTest nextStep={() => setStep('카메라테스트')} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DeviceCheckPage;
