'use client';

import React from 'react';
import styles from './styles/progress-ring.module.css';

interface Props {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

const ProgressRing = ({ progress, size = 410, strokeWidth = 6 }: Props) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} className={styles.ring}>
      <circle
        className={styles.bg}
        stroke="rgba(255, 255, 255, 0.2)"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className={styles.fg}
        stroke="white"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default ProgressRing;
