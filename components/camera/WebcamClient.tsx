'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

const WebcamClient = () => {
  const webcamRef = useRef<Webcam>(null);
  const [deviceId, setDeviceId] = useState([]);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const handleDevices = useCallback(
    (mediaDevices: MediaDeviceInfo[]) => {
      return setDevices(
        mediaDevices.filter((value) => value.kind === 'videoinput'),
      );
    },
    [setDevices],
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  console.log(devices);
  console.log(deviceId);

  return (
    <>
      {devices.map((device, key) => (
        <div key={key} style={{ width: '800px' }}>
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={true}
            videoConstraints={{
              aspectRatio: 1.71,
              facingMode: 'user',
              deviceId: device.deviceId,
            }}
          />
          {device.label || `Device ${key + 1}`}
        </div>
      ))}
    </>
  );
};

export default WebcamClient;
