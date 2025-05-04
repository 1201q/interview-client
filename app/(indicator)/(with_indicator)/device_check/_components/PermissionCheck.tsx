'use client';

import styles from './styles/permission.module.css';

import { useRequestMediaAccess } from './hooks/useRequestMediaAccess';

import Mic from '@/public/mic.svg';
import Camera from '@/public/webcam-cam.svg';
import { useEffect } from 'react';
import PageHeader from './PageHeader';

interface Props {
  handleCompleted: (menu: string) => void;
  query: string;
}

const PermissionCheck = ({ handleCompleted, query }: Props) => {
  const { camera, mic } = useRequestMediaAccess();

  const dotStatus = (status: boolean | null) => {
    if (status === null) {
      return styles.loading;
    } else if (!status) {
      return styles.red;
    } else {
      return styles.green;
    }
  };

  useEffect(() => {
    if (camera && mic) {
      handleCompleted(query);
    }
  }, [camera, mic]);

  return (
    <>
      <PageHeader
        titleText="권한 체크"
        subtitleText="마이크와 카메라 권한이 필요해요."
      />
      <div className={styles.container}>
        <div className={styles.itemContainer}>
          <div className={styles.flex}>
            <Mic />
            <p>마이크 권한</p>
          </div>
          <div className={styles.flex}>
            <div className={`${styles.dot} ${dotStatus(mic)}`}></div>
          </div>
        </div>
        <div className={styles.itemContainer}>
          <div className={styles.flex}>
            <Camera />
            <p>카메라 권한</p>
          </div>
          <div className={styles.flex}>
            <div className={`${styles.dot} ${dotStatus(camera)}`}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PermissionCheck;
