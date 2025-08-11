'use client';

import styles from './styles/container.module.css';
import sharedStyles from './styles/shared.module.css';

import useCreateQuestion from './hooks/useCreateQuestion';
import { AnimatePresence, Variants, motion } from 'motion/react';

import { Circle, Check, X } from 'lucide-react';

import { useState } from 'react';
import { useMediaPermissions } from './hooks/useMediaPermissions';

import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';

// 등장 애니메이션
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // 자식간
      delayChildren: 0.1, // 첫 자식 시작까지 딜레이
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { stiffness: 80, type: 'spring' } },
};

const CheckPage = ({
  props,
}: {
  props: ReturnType<typeof useCreateQuestion>;
}) => {
  const { cameraPermission, micPermission, requestPermission } =
    useMediaPermissions();

  const loading = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    ></motion.div>
  );
};

export default CheckPage;
