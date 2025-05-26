import { useRef } from 'react';

export const useInterviewRecorder = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const resolveRef = useRef<((b: Blob) => void) | null>(null);

  // const startRecording = async () => {
  //   const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //   const mediaRecorder = new MediaRecorder(stream);

  //   mediaRecorderRef.current = mediaRecorder;
  //   chunksRef.current = [];

  //   mediaRecorder.ondataavailable = (e) => {
  //     if (e.data.size > 0) {
  //       chunksRef.current.push(e.data);
  //     }
  //   };

  //   mediaRecorder.start();
  // };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    chunksRef.current = [];
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }

      if (mediaRecorder.state === 'inactive' && resolveRef.current) {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        resolveRef.current(audioBlob);
        resolveRef.current = null;
      }
    };

    console.log('시작됨');
    mediaRecorder.start();
  };

  const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;

      if (!recorder) {
        return resolve(new Blob());
      }

      // recorder.onstop = async () => {
      //   setTimeout(() => {
      //     const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      //     resolve(audioBlob);
      //   }, 2000);
      // };

      resolveRef.current = resolve;
      recorder.stop();

      console.log('종료됨');
    });
  };

  return {
    startRecording,
    stopRecording,
  };
};
