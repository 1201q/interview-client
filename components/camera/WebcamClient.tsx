'use client';
import { useRef } from 'react';
import styles from './styles/webcam.module.css';
import Webcam from 'react-webcam';

const WebcamClient = () => {
  const webcamRef = useRef<Webcam>(null);

  return (
    <div className={styles.container}>
      <Webcam
        ref={webcamRef}
        audio={false}
        mirrored={true}
        videoConstraints={{
          aspectRatio: 1.71,
          facingMode: 'user',
        }}
      />
      <Webcam
        ref={webcamRef}
        audio={false}
        mirrored={true}
        videoConstraints={{
          aspectRatio: 0.67777,
          facingMode: 'user',
        }}
      />
    </div>
  );
};

export default WebcamClient;
