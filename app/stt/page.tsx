'use client';

import { useEffect, useRef, useState } from 'react';
import { getEphemeralToken } from '@/utils/services/stt';

const Page = () => {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [connected, setConnected] = useState(false);
  const [stable, setStable] = useState('');
  const [live, setLive] = useState('');

  const start = async () => {
    // 1. 토큰 확인
    const tokenRes = await getEphemeralToken();
    const token = tokenRes.value ?? null;
    if (!token) throw new Error('EphemeralToken 없음');

    // 2. RTCPeerConnection
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
    });
    pcRef.current = pc;

    pc.oniceconnectionstatechange = () => {
      const st = pc.iceConnectionState;

      if (st === 'connected') setConnected(true);
      if (['disconnected', 'failed', 'closed'].includes(st)) cleanup();
    };

    // 만약 서버가 dc를 생성할 경우?
    pc.ondatachannel = (e) => {
      const ch = e.channel;

      ch.onmessage = (event) => {
        try {
          handleEvent(JSON.parse(event.data));
        } catch (error) {
          console.log(error);
        }
      };
    };

    // 클라가 dc를 생성
    const dc = pc.createDataChannel('oai-events');
    dcRef.current = dc;
    dc.onmessage = (e) => {
      try {
        handleEvent(JSON.parse(e.data));
      } catch (error) {
        console.log(error);
      }
    };

    // 3. 마이크 세팅
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    streamRef.current = stream;
    const [track] = stream.getAudioTracks();

    if (track && 'contentHint' in track) track.contentHint = 'speech';
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    // 4. sdp 생성/설정
    await pc.setLocalDescription(await pc.createOffer());

    // 5. ICE gathering 완료 대기
    await new Promise<void>((resolve) => {
      if (pc.iceGatheringState === 'complete') return resolve();
      pc.addEventListener('icegatheringstatechange', () => {
        if (pc.iceGatheringState === 'complete') resolve();
      });
    });

    // 6. OpenAI Realtime 요청
    const sdpRes = await fetch(
      'https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/sdp',
          'OpenAI-Beta': 'realtime=v1',
        },
        body: pc.localDescription!.sdp,
      },
    );

    const raw = await sdpRes.text();
    if (!sdpRes.ok || !raw.startsWith('v=')) {
      console.error('SDP POST 실패:', sdpRes.status, raw.slice(0, 200));
      throw new Error('Realtime SDP 교환 실패');
    }

    await pc.setRemoteDescription({ type: 'answer', sdp: raw });
  };

  const handleEvent = (msg: any) => {
    if (
      msg.type === 'conversation.item.input_audio_transcription.delta' &&
      msg.delta
    ) {
      console.log(msg);
      setLive((p) => p + msg.delta);
    }
    if (
      msg.type === 'conversation.item.input_audio_transcription.completed' &&
      msg.transcript
    ) {
      console.log(msg);
      setStable((p) => (p ? p + ' ' : '') + msg.transcript);
      setLive('');
    }
  };

  const cleanup = () => {
    try {
      dcRef.current?.close();
      pcRef.current?.getSenders().forEach((s) => s.track?.stop());
      streamRef.current?.getTracks().forEach((t) => t.stop());

      pcRef.current?.close();
    } finally {
      dcRef.current = null;
      pcRef.current = null;
      streamRef.current = null;
      setConnected(false);
    }
  };

  const stop = () => {
    cleanup();
  };

  useEffect(() => {
    return () => cleanup();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={start} disabled={connected}>
          Start
        </button>
        <button onClick={stop} disabled={!connected}>
          Stop
        </button>
      </div>

      <h3 style={{ marginTop: 16 }}>확정 텍스트</h3>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{stable}</pre>

      <h3>진행 중(델타)</h3>
      <pre style={{ whiteSpace: 'pre-wrap', opacity: 0.6 }}>{live}</pre>
    </div>
  );
};

export default Page;
