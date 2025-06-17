'use client';

import { Transcriber } from '@/utils/libs/transcriber';
import { getEphemeralToken } from '@/utils/services/stt';

const Page = () => {
  const startTranscription = async () => {
    const { value } = await getEphemeralToken();

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const transcriber = new Transcriber(value, stream, {
      onInterimTranscript: (transcript) => {
        console.log('Interim Transcript:', transcript);
      },
      onError(error) {
        console.log('Transcription Error:', error);
      },
      onFinalTranscript: (transcript) => {
        console.log('Final Transcript:', transcript);
      },
    });

    await transcriber.start();
  };

  return (
    <div>
      <button onClick={startTranscription}>시작</button>
    </div>
  );
};

export default Page;
