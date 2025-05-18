import { useEffect, useRef, useState } from 'react';

export const useMicRecorder = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    const handleRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunks.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
          setAudioBlob(blob);

          audioChunks.current = [];
        };

        recorderRef.current = recorder;
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    handleRecorder();

    return () => {
      recorderRef.current?.stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const startRecording = () => {
    if (recorderRef.current && recorderRef.current.state === 'inactive') {
      recorderRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      recorderRef.current.stop();
    }
  };

  return { audioBlob, startRecording, stopRecording };
};
