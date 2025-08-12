'use client';

import { Variants, motion } from 'motion/react';

import dynamic from 'next/dynamic';
import Button from '../shared/Button';

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

const CheckPage = () => {
  return (
    <div style={{ width: '100%' }}>
      <Button text="ㅌㅅㅌ" />
    </div>
  );
};

export default CheckPage;
