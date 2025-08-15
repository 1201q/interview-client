'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { getEphemeralToken } from '../services/stt';
import { Delta, Transcript } from '../types/types';

export type AudioSource = 'mic' | 'tab';

export interface RealtimeOptions {
  onEvent?: (e: any) => void;
}

export const useRealtimeTranscribe = (options: RealtimeOptions) => {
  const { onEvent } = options;

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [connected, setConnected] = useState(false);
  const [stable, setStable] = useState('');
  const [live, setLive] = useState('');

  const [rawStableData, setRawStableData] = useState<Transcript[]>([]);
  const [rawLiveData, setRawLiveData] = useState<Delta[]>([]);

  const resetText = useCallback(() => {
    setStable('');
    setLive('');
    setRawLiveData([]);
    setRawStableData([]);
  }, []);

  const handleEvent = useCallback(
    (msg: any) => {
      onEvent?.(msg);

      if (msg.type?.endsWith('input_audio_transcription.delta') && msg.delta) {
        const data = msg as Delta;

        setLive((p) => p + data.delta);
        setRawLiveData((prev) => [...prev, data]);

        return;
      }
      if (
        msg.type?.endsWith('input_audio_transcription.completed') &&
        msg.transcript
      ) {
        const data = msg as Transcript;

        setRawStableData((prev) => [...prev, data]);
        setRawLiveData([]);

        setStable((p) => (p ? p + ' ' : '') + data.transcript);
        setLive('');
        return;
      }
    },
    [onEvent],
  );

  const cleanup = useCallback(() => {
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
  }, []);

  const start = useCallback(
    async (audioSource: AudioSource) => {
      resetText();

      // 1. 토큰 확인
      const tokenRes = await getEphemeralToken();
      const token = tokenRes.value ?? null;
      if (!token) throw new Error('EphemeralToken 없음');

      // 2. RTCPeerConnection
      // OpenAI Realtime과 WebRTC 연결할 객체.
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

      let stream: MediaStream;
      if (audioSource === 'mic') {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      } else {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        // 비디오는 바로 끔
        displayStream.getVideoTracks().forEach((t) => t.stop());

        const audio = displayStream.getAudioTracks();

        if (!audio.length) {
          throw new Error(
            '탭 오디오를 사용할 수 없습니다. 오디오가 활성화된 탭을 선택하세요.',
          );
        }

        stream = new MediaStream([audio[0]]);
      }

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
    },
    [resetText, handleEvent, cleanup],
  );

  const flushAndStop = useCallback(async () => {
    const dc = dcRef.current;

    if (!dc || dc.readyState !== 'open') {
      cleanup();
      return;
    }

    let isFinal = false;
    const onMessage = (e: MessageEvent) => {
      try {
        const msg = JSON.parse(e.data);

        if (
          (msg.type === 'transcript.final' && msg.text) ||
          (msg.type?.endsWith('input_audio_transcription.completed') &&
            msg.transcript)
        ) {
          isFinal = true;
        }
      } catch (error) {
        console.log(error);
      }
    };

    dc?.addEventListener('message', onMessage);

    // 지금까지 버퍼 커밋
    dc?.send(JSON.stringify({ type: 'input_audio_buffer.commit' }));

    await new Promise<void>((resolve) => {
      const t = setTimeout(() => resolve(), 1200);

      const polling = () =>
        isFinal ? (clearTimeout(t), resolve()) : setTimeout(polling, 50);
      polling();
    });

    dc?.removeEventListener('message', onMessage);
    cleanup();
  }, [cleanup]);

  useEffect(() => () => cleanup(), [cleanup]);

  return {
    connected,
    stable,
    live,
    start,
    flushAndStop,
    stop: cleanup,
    resetText,
    rawStableData,
    refs: { pcRef, dcRef, streamRef },
  };
};
