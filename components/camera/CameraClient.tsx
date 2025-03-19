'use client';

import { useRef, useState } from 'react';
import styles from './styles/camera.module.css';
import RunHuman from './Human';

const CameraClient = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  let stream = null;

  const startCamera = async () => {
    if (!isCameraOn) {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraOn(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.cameraContainer}>
        <video ref={videoRef} playsInline autoPlay muted></video>
      </div>
      <button onClick={startCamera}>시작</button>
      <button onClick={stopCamera}>종료</button>
      {isCameraOn && videoRef.current && videoRef && (
        <RunHuman videoRef={videoRef} />
      )}
    </div>
  );
};

export default CameraClient;
