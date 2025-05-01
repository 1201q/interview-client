import { uploadAudioForSTT } from '@/utils/services/stt';
import { useRef, useState } from 'react';

export const useStt = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [text, setText] = useState<null | string>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    setText(null);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;
    audioChunks.current = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
      }
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;

    setIsLoading(true);

    recorderRef.current.stop();

    recorderRef.current.onstop = async () => {
      const blob = new Blob(audioChunks.current, { type: 'audio/webm' });

      try {
        const text = await uploadAudioForSTT(blob);
        setText(text);
      } catch (error) {
        console.error('에러', error);
      } finally {
        setIsLoading(false);
        setIsRecording(false);
      }
    };
  };

  return { isRecording, isLoading, text, startRecording, stopRecording };
};
