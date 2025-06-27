'use client';

import { Transcriber } from '@/utils/libs/transcriber';
import { getEphemeralToken } from '@/utils/services/stt';
import { useRef, useState } from 'react';
import Waveform from './_components/Waveform';

import styles from './page.module.css';
import WebcamInstance from '@/components/refactorWebcam/WebcamInstance';
import NewHeader from '@/components/header/NewHeader';

const Page = () => {
  const transcriberRef = useRef<Transcriber | null>(null);

  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );

  const [isRunning, setIsRunning] = useState(false);
  const [transcript, setTranscript] = useState<string>('');

  const startTranscription = async () => {
    if (transcriberRef.current) return;

    const { value } = await getEphemeralToken();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const recorder = new MediaRecorder(stream);

    setAudioStream(stream);
    setMediaRecorder(recorder);
    setTranscript('');

    const transcriber = new Transcriber(value, stream, {
      onInterimTranscript: (transcript) => {
        console.log('Interim Transcript:', transcript);
      },
      onFinalTranscript: (transcript) => {
        console.log('Final Transcript:', transcript);

        setTranscript((prev) => prev + ' ' + transcript);
      },
      onError(error) {
        console.log('Transcription Error:', error);
      },
    });

    transcriberRef.current = transcriber;

    await transcriber.start();
    setIsRunning(true);
  };

  const stopTranscription = () => {
    transcriberRef.current?.stop();
    transcriberRef.current = null;

    audioStream?.getTracks().forEach((track) => track.stop());
    setAudioStream(null);
    setIsRunning(false);
    setMediaRecorder(null);

    console.log('Transcription stopped.');
  };

  return (
    <div>
      <button onClick={startTranscription}>시작</button>
      <button onClick={stopTranscription}>정지</button>
      <div>{/* <Waveform /> */}</div>
      <div>{transcript}</div>
    </div>
  );
};

export default Page;
