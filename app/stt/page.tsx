'use client';

import { useRealtimeTranscribe } from '@/utils/hooks/useRealtimeTranscribe';

const Page = () => {
  const { connected, stable, live, start, flushAndStop, resetText } =
    useRealtimeTranscribe({
      onEvent: (e: any) => {
        console.log(e);
      },
    });

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => start('mic')} disabled={connected}>
          Start (mic)
        </button>
        <button onClick={() => start('tab')} disabled={connected}>
          Start (tab)
        </button>
        <button onClick={flushAndStop} disabled={!connected}>
          Stop (Flush & Close)
        </button>
        <button onClick={resetText}>Clear Text</button>
      </div>
      <h4>{connected ? '연결' : '연결 끊김'}</h4>
      <h3 style={{ marginTop: 16 }}>확정 텍스트</h3>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{stable}</pre>

      <h3>진행 중(델타)</h3>
      <pre style={{ whiteSpace: 'pre-wrap', opacity: 0.6 }}>{live}</pre>
    </div>
  );
};

export default Page;
