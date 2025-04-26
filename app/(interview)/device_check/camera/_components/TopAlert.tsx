'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './styles/top.alert.module.css';

interface Props {
  text: string;
}

const TopAlert = ({ text }: Props) => {
  return (
    <div className={styles.container}>
      <p>{text}</p>
    </div>
  );
};
export default TopAlert;
