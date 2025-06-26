'use client';

import { Transcriber } from '@/utils/libs/transcriber';
import { getEphemeralToken } from '@/utils/services/stt';
import { useRef } from 'react';

const Page = () => {
  const transcriberRef = useRef<Transcriber | null>(null);

  const startTranscription = async () => {
    if (transcriberRef.current) return;

    const { value } = await getEphemeralToken();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const transcriber = new Transcriber(value, stream, {
      onInterimTranscript: (transcript) => {
        console.log('Interim Transcript:', transcript);
      },
      onFinalTranscript: (transcript) => {
        console.log('Final Transcript:', transcript);
      },
      onError(error) {
        console.log('Transcription Error:', error);
      },
    });

    transcriberRef.current = transcriber;

    await transcriber.start();
  };

  const stopTranscription = () => {
    transcriberRef.current?.stop();
    transcriberRef.current = null;
    console.log('Transcription stopped.');
  };

  return (
    <div>
      <button onClick={startTranscription}>시작</button>
      <button onClick={stopTranscription}>정지</button>
    </div>
  );
};

export default Page;
