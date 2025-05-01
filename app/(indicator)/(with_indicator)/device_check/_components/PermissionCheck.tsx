'use client';

import styles from './styles/permission.module.css';

import { useRequestMediaAccess } from './hooks/useRequestMediaAccess';

import Mic from '@/public/mic.svg';
import Camera from '@/public/webcam.svg';

interface Props {
  nextStep: () => void;
}

const PermissionCheck = ({ nextStep }: Props) => {
  const { camera, mic } = useRequestMediaAccess();

  const check = camera && mic;

  return (
    <div className={styles.container}>
      <div className={styles.itemContainer}>
        <div className={styles.flex}>
          <Mic />
          <p>마이크 권한</p>
        </div>
        <div className={styles.flex}>
          <div className={`${styles.dot} ${styles.green}`}></div>
        </div>
      </div>
      <div className={styles.itemContainer}>
        <div className={styles.flex}>
          <div className={styles.webcam}>
            <Camera />
          </div>
          <p>카메라 권한</p>
        </div>{' '}
        <div className={styles.flex}>
          <div className={`${styles.dot} ${styles.red}`}></div>
        </div>
      </div>
    </div>
  );
};

export default PermissionCheck;
