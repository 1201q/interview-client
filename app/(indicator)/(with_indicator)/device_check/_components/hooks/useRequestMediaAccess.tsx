import { useEffect, useState } from 'react';

interface Status {
  camera: boolean | null;
  mic: boolean | null;
}

export const useRequestMediaAccess = (): Status => {
  const [status, setStatus] = useState<Status>({
    camera: null,
    mic: null,
  });

  useEffect(() => {
    const requestAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setStatus({
          camera: true,
          mic: true,
        });

        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        setStatus({
          camera: false,
          mic: false,
        });
      }
    };

    requestAccess();
  }, []);

  return status;
};
