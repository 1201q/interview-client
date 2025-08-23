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

  // 송 신 제어
  const senderRef = useRef<RTCRtpSender | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);
  const transceiverRef = useRef<RTCRtpTransceiver | null>(null);

  const [connected, setConnected] = useState(false);
  const [audioSource, setAudioSource] = useState<AudioSource>('mic');
  const [paused, setPaused] = useState(false);

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

  const resetMedia = useCallback(() => {
    if (senderRef.current) {
      try {
        senderRef.current = null;
      } catch (error) {}
    }

    // 트랙을 정리
    if (trackRef.current) {
      try {
        trackRef.current.stop();
      } catch (error) {}

      trackRef.current = null;
    }

    // 스트림을 정리
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch (error) {}
      });

      streamRef.current = null;
    }
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
      try {
        dcRef.current?.close();
      } catch (error) {}

      resetMedia();

      try {
        transceiverRef.current?.stop();
      } catch {}

      try {
        pcRef.current?.close();
      } catch {}
    } finally {
      dcRef.current = null;
      pcRef.current = null;
      transceiverRef.current = null;

      setConnected(false);
      setPaused(false);
    }
  }, [resetMedia]);

  const connectTranscription = useCallback(async () => {
    resetText();

    if (pcRef.current) {
      cleanup();
    }

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

    // 핵심: 오디오 m=라인을 선점 (재협상 없이 나중에 트랙만 붙임)
    transceiverRef.current = pc.addTransceiver('audio', {
      direction: 'sendonly',
    });
    senderRef.current = transceiverRef.current.sender;

    // SDP 생성/설정
    await pc.setLocalDescription(await pc.createOffer());

    // ICE gathering 완료 대기 (리스너 해제를 포함)
    await new Promise<void>((resolve) => {
      if (pc.iceGatheringState === 'complete') return resolve();
      const handler = () => {
        if (pc.iceGatheringState === 'complete') {
          pc.removeEventListener('icegatheringstatechange', handler);
          resolve();
        }
      };
      pc.addEventListener('icegatheringstatechange', handler);
    });

    // OpenAI Realtime 요청
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
  }, [cleanup, handleEvent, resetText]);

  // prepare
  const prepareAudioTrack = useCallback(async (source: AudioSource) => {
    if (!pcRef.current || !senderRef.current) {
      throw new Error('PeerConnection 없음. 먼저 connect() 호출하세요.');
    }

    setAudioSource(source);
    setPaused(true);

    let stream: MediaStream;
    if (source === 'mic') {
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
    if (!track) throw new Error('오디오 트랙 없음');

    try {
      if (track && 'contentHint' in track) track.contentHint = 'speech';
    } catch {}

    track.enabled = false;
    trackRef.current = track;

    await senderRef.current.replaceTrack(track);
  }, []);

  // 오디오를 전송함. 재협상 x
  const startSendingAudio = useCallback(async (source: AudioSource) => {
    if (!pcRef.current || !senderRef.current) {
      throw new Error('PeerConnection 없음. 먼저 connect() 호출하세요.');
    }

    setAudioSource(source);
    setPaused(false);

    let stream: MediaStream;
    if (source === 'mic') {
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
    if (!track) throw new Error('오디오 트랙 없음');

    try {
      if (track && 'contentHint' in track) track.contentHint = 'speech';
    } catch {}

    trackRef.current = track;

    // 시작~
    await senderRef.current.replaceTrack(track);
  }, []);

  const getAudioSender = (pc: RTCPeerConnection | null) => {
    return pc?.getSenders().find((s) => s.track?.kind === 'audio') ?? null;
  };

  const getTranscriptSnapshot = useCallback(() => {
    const stableText = rawStableData
      .map((s) => s.transcript)
      .join(' ')
      .trim();
    const liveText = rawLiveData
      .map((d) => d.delta)
      .join('')
      .trim();

    if (!stableText) return liveText;
    if (!liveText) return stableText;
    return `${stableText} ${liveText}`.trim();
  }, [rawLiveData, rawStableData]);

  // 버퍼 커밋후 -> 마지막 텍스트까지 수집
  // 옵션으로 연결을 유지할지를 받습니다.
  const flushAndStop = useCallback(
    async (opt?: { keepConnection?: boolean }) => {
      const keepConnection = !!opt?.keepConnection;
      const dc = dcRef.current;

      // pause
      const track = streamRef.current?.getAudioTracks()[0];
      if (track) track.enabled = false;

      if (!dc || dc.readyState !== 'open') {
        const text = getTranscriptSnapshot();

        if (!keepConnection) {
          cleanup();
        }

        return { text, segments: rawStableData, deltas: rawLiveData };
      }

      const segments: Transcript[] = [];
      const deltas: Delta[] = [];
      let isFinal = false;

      const onMessage = (e: MessageEvent) => {
        try {
          const msg = JSON.parse(e.data);

          if (
            msg.type?.endsWith('input_audio_transcription.delta') &&
            msg.delta
          ) {
            deltas.push(msg as Delta);
          }

          if (
            msg.type?.endsWith('input_audio_transcription.completed') &&
            msg.transcript
          ) {
            segments.push(msg as Transcript);
            isFinal = true;
          }

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

      const stableData = [...rawStableData, ...segments];
      const liveData = [...rawLiveData, ...deltas];

      const stableText = stableData
        .map((s) => s.transcript)
        .join(' ')
        .trim();
      const liveText = liveData
        .map((d) => d.delta)
        .join(' ')
        .trim();

      const finalText =
        stableText && liveText
          ? `${stableText} ${liveText}`.trim()
          : stableText || liveText;

      if (!keepConnection) {
        cleanup();
      } else {
        // 연결은 유지합니다.
        try {
          streamRef.current?.getTracks().forEach((t) => {
            try {
              t.stop();
            } catch {}
          });
        } finally {
          streamRef.current = null;
          trackRef.current = null;
        }
      }

      return { text: finalText, segments: stableData, deltas: liveData };
    },
    [cleanup, getTranscriptSnapshot, rawLiveData, rawStableData],
  );

  // 탭과 마이크 전환 (테스트용)
  const switchAudioSource = useCallback(async (source: AudioSource) => {
    const pc = pcRef.current;
    const sender = senderRef.current ?? getAudioSender(pc);

    if (!pc || !sender) throw new Error('오디오 송신자 없음');

    let newStream: MediaStream;

    if (source === 'mic') {
      newStream = await navigator.mediaDevices.getUserMedia({
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

      displayStream.getVideoTracks().forEach((t) => t.stop());
      const audio = displayStream.getAudioTracks();

      if (!audio.length)
        throw new Error(
          '탭 오디오를 사용할 수 없습니다. 오디오가 활성화된 탭을 선택하세요.',
        );
      newStream = new MediaStream([audio[0]]);
    }

    const [newTrack] = newStream.getAudioTracks();
    if (!newTrack) throw new Error('새 오디오 트랙이 없습니다.');

    try {
      if (newTrack && 'contentHint' in newTrack)
        newTrack.contentHint = 'speech';
    } catch {}

    // 기존 트랙을 교체함.
    await sender.replaceTrack(newTrack);

    streamRef.current?.getTracks().forEach((t) => {
      try {
        t.stop();
      } catch {}
    });
    streamRef.current = newStream;

    trackRef.current = newTrack;
    newTrack.enabled = true;
    setPaused(false);
    setAudioSource(source);
  }, []);

  // 정지
  const pauseTranscription = useCallback(() => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = false;
      setPaused(true);
    }
  }, []);

  // 재개
  const resumeTranscription = useCallback(() => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = true;
      setPaused(false);
    }
  }, []);

  const canResume =
    !!streamRef.current &&
    !!pcRef.current?.getSenders().find((s) => s.track?.kind === 'audio');

  // 1. 이전 코드 ///////////
  const start = useCallback(
    async (source: AudioSource) => {
      resetText();
      setAudioSource(source);
      setPaused(false);

      if (pcRef.current) cleanup();

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
      if (source === 'mic') {
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
      if (!track) throw new Error('오디오 트랙 없음');

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
  // 이전 코드 ///////////

  useEffect(() => () => cleanup(), [cleanup]);

  return {
    connected,
    audioSource,
    paused,
    canResume,

    // 텍스트
    stable,
    live,
    rawStableData,
    rawLiveData,

    // 제어
    connectTranscription,
    flushAndStop,
    stop: cleanup,
    resetText,
    getTranscriptSnapshot,
    prepareAudioTrack,

    // 제어 2
    switchAudioSource,
    pauseTranscription,
    resumeTranscription,

    // refs
    refs: { pcRef, dcRef, streamRef },

    // 레거시
    start,
    startSendingAudio,
  };
};
