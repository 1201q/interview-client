'use client';

import useCreateQuestion from '@/utils/hooks/useCreateQuestion';
import { Variants, motion } from 'motion/react';

import { useMediaPermissions } from '@/utils/hooks/useMediaPermissions';

import { FilesetResolver } from '@mediapipe/tasks-vision';

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
