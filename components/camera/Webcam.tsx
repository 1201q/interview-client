'use client';
import { useRef } from 'react';
import styles from './styles/webcam.module.css';
import Webcam from 'react-webcam';

interface Props {
  size: { width: number; height: number };
}

const WebcamComponent = ({ size }: Props) => {
  const webcamRef = useRef<Webcam>(null);

  return (
    <>
      <Webcam
        size={size.width}
        ref={webcamRef}
        audio={false}
        mirrored={true}
        videoConstraints={{
          facingMode: 'user',
        }}
      />
    </>
  );
};

export default WebcamComponent;
