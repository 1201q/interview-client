'use client';

import { useRealtimeTranscribe } from '@/utils/hooks/useRealtimeTranscribe';
import { useEffect, useRef, useState } from 'react';

const Page = () => {
  const {
    connected,
    connectTranscription,
    prepareAudioTrack,
    resumeTranscription,
    canResume,
    flushAndStop,
  } = useRealtimeTranscribe({
    onEvent: (e: any) => {},
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [blobInfo, setBlobInfo] = useState<{
    size: number;
    type: string;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        rowGap: '10px',
        padding: 36,
      }}
    >
      <div>
        {'connected: '}
        {connected ? 'connected' : 'disconnected'}
      </div>
      <div>
        {'canResume: '}
        {canResume ? 'true' : 'false'}
      </div>

      <button
        style={{ backgroundColor: 'lightgray', padding: '5px 10px' }}
        onClick={async () => {
          await connectTranscription();
        }}
      >
        connect Transcription
      </button>
      <button
        style={{ backgroundColor: 'lightgray', padding: '5px 10px' }}
        onClick={async () => {
          await prepareAudioTrack('tab');
        }}
      >
        prepareAudioTrack
      </button>
      <button
        style={{ backgroundColor: 'lightgray', padding: '5px 10px' }}
        onClick={() => {
          resumeTranscription();
        }}
      >
        resumeTranscription
      </button>

      <button
        style={{ backgroundColor: 'lightgray', padding: '5px 10px' }}
        onClick={async () => {
          const end = await flushAndStop();

          console.log(end);

          if (end.audioBlob && end.audioBlob.size > 0) {
            if (audioUrl) URL.revokeObjectURL(audioUrl);

            const url = URL.createObjectURL(end.audioBlob);

            setAudioUrl(url);
            setBlobInfo({ size: end.audioBlob.size, type: end.audioBlob.type });

            try {
              if (audioRef.current) {
                audioRef.current.src = url;
                await audioRef.current.play();
              }
            } catch (error) {
              console.log('press play');
            }
          } else {
            alert('audioblob 없음');
          }
        }}
      >
        flushAndStop
      </button>
      <audio
        ref={audioRef}
        controls
        style={{ width: 400 }}
        src={audioUrl ?? undefined}
      />
      {audioUrl && (
        <a href={audioUrl} download="recording.webm" style={{ marginTop: 8 }}>
          Download recording
        </a>
      )}
      {blobInfo && (
        <div style={{ opacity: 0.7 }}>
          blob type: {blobInfo.type || '(unknown)'} / size: {blobInfo.size}{' '}
          bytes
        </div>
      )}
    </div>
  );
};

export default Page;
