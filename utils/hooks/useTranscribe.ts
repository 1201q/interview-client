'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { getEphemeralToken } from '../services/stt';
import { Delta, Transcript } from '../types/types';

export type AudioSource = 'mic' | 'tab';

type ConnStatus = 'idle' | 'connecting' | 'connected';
type RecStatus = 'idle' | 'prepared' | 'recording' | 'paused';

type TokenPayload = {
  jobRole?: string;
  questionText?: string;
  keywords?: string[];
};

const STT_URL =
  'https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17';

export interface Options {
  onEvent?: (e: any) => void;
}

export const useTranscribe = ({ onEvent }: Options) => {
  // --------- webrtc, media refs --------
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const senderRef = useRef<RTCRtpSender | null>(null);
  const transceiverRef = useRef<RTCRtpTransceiver | null>(null);

  // ---- recorder refs ----
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordChunksRef = useRef<BlobPart[]>([]);

  // ---- hook states ----
  const [connStatus, setConnStatus] = useState<ConnStatus>('idle');
  const [recStatus, setRecStatus] = useState<RecStatus>('idle');

  const [audioSource, setAudioSource] = useState<AudioSource>('mic');
  const [canResume, setCanResume] = useState(false);

  // ---- text ----
  const [stable, setStable] = useState('');
  const [live, setLive] = useState('');
  const [rawStableData, setRawStableData] = useState<Transcript[]>([]);
  const [rawLiveData, setRawLiveData] = useState<Delta[]>([]);

  // ==============================================================
  // ---- 공용 유틸 ----
  const resetText = useCallback(() => {
    setStable('');
    setLive('');
    setRawStableData([]);
    setRawLiveData([]);
  }, []);

  const getTranscriptSnapshot = useCallback(() => {
    const sd = rawStableData
      .map((d) => d.transcript)
      .join(' ')
      .trim();
    const ld = rawLiveData
      .map((d) => d.delta)
      .join('')
      .trim();

    return sd && ld ? `${sd} ${ld}`.trim() : sd || ld;
  }, [rawLiveData, rawStableData]);

  const resetMedia = useCallback(() => {
    try {
      senderRef.current = null;
    } catch {}

    try {
      streamRef.current?.getTracks().forEach((track) => {
        // track stop
        try {
          track.stop();
        } catch {}
        //
      });
    } catch {}

    streamRef.current = null;
  }, []);

  const cleanup = useCallback(() => {
    //
    try {
      dcRef.current?.close();
    } catch {}

    try {
      transceiverRef.current?.stop();
    } catch {}

    try {
      pcRef.current?.close();
    } catch {}

    //
    resetMedia();

    //
    dcRef.current = null;
    transceiverRef.current = null;
    pcRef.current = null;

    try {
      mediaRecorderRef.current?.stop();
    } catch {}

    mediaRecorderRef.current = null;
    recordChunksRef.current = [];

    setCanResume(false);
    setRecStatus('idle');
    setConnStatus('idle');
  }, [resetMedia]);

  const handleEvent = useCallback(
    (msg: any) => {
      onEvent?.(msg);
      if (msg.type?.endsWith('input_audio_transcription.delta') && msg.delta) {
        setLive((p) => p + (msg as Delta).delta);
        setRawLiveData((prev) => [...prev, msg as Delta]);
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

  // ==============================================================
  // ---- connect 관련 ----
  const connectTranscription = useCallback(
    async (payload: TokenPayload = {}) => {
      resetText();

      console.time('[connect] total');
      console.time('[connect] token');
      setCanResume(false);

      if (pcRef.current) cleanup();

      setConnStatus('connecting');

      // 1. 토큰 확인
      const tokenRes = await getEphemeralToken(payload);
      const token = tokenRes.value ?? null;
      console.timeEnd('[connect] token');

      if (!token) {
        setConnStatus('idle');
        throw new Error('EphemeralToken 없음');
      }

      // 2. RTCPeerConnection
      // OpenAI Realtime과 WebRTC 연결할 객체.

      // const pc = new RTCPeerConnection({
      //   iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
      // });

      const pc = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              'stun:stun.l.google.com:19302',
              'stun:global.stun.twilio.com:3478',
            ],
          },
        ],
        bundlePolicy: 'max-bundle',
      });

      pcRef.current = pc;

      console.log('oniceconnectionstatechange--------------');

      pc.oniceconnectionstatechange = () => {
        const st = pc.iceConnectionState;

        if (st === 'connected') {
          setConnStatus('connected');
        }
        if (['disconnected', 'failed', 'closed'].includes(st)) cleanup();
      };

      console.log('ondatachannel--------------');

      // 만약 서버가 dc를 생성할 경우?
      pc.ondatachannel = (e) => {
        e.channel.onmessage = (event) => {
          try {
            handleEvent(JSON.parse(event.data));
          } catch {}
        };
      };

      console.log('클라가 dc를 생성--------------');
      // 클라가 dc를 생성
      const dc = pc.createDataChannel('oai-events');
      dc.onopen = () => console.log('[dc] open');

      dc.onmessage = (e) => {
        try {
          handleEvent(JSON.parse(e.data));
        } catch {}
      };
      dcRef.current = dc;

      console.log('핵심--------------');

      // 핵심: 오디오 m=라인을 선점 (재협상 없이 나중에 트랙만 붙임)
      transceiverRef.current = pc.addTransceiver('audio', {
        direction: 'sendonly',
      });
      senderRef.current = transceiverRef.current.sender;

      // SDP 생성/설정
      console.time('[connect] offer+local');
      await pc.setLocalDescription(await pc.createOffer());
      console.timeEnd('[connect] offer+local');

      // ICE gathering 완료 대기 (리스너 해제를 포함)
      // await new Promise<void>((resolve) => {
      //   if (pc.iceGatheringState === 'complete') return resolve();
      //   const handler = () => {
      //     if (pc.iceGatheringState === 'complete') {
      //       pc.removeEventListener('icegatheringstatechange', handler);
      //       resolve();
      //     }
      //   };
      //   pc.addEventListener('icegatheringstatechange', handler);
      // });

      await new Promise<void>((resolve) => {
        let done = false;
        const finish = () => {
          if (!done) {
            done = true;
            resolve();
          }
        };
        const t = setTimeout(() => {
          console.warn('[ICE] timeout → proceed with partial candidates');
          finish();
        }, 1500);

        pc.onicecandidate = (e) => {
          if (e.candidate) {
            console.log('[ICE] cand:', e.candidate.type, e.candidate.protocol);
          } else {
            console.log('[ICE] null candidate (completed)');
            clearTimeout(t);
            finish();
          }
        };
        if (pc.iceGatheringState === 'complete') {
          clearTimeout(t);
          finish();
        }
      });

      // OpenAI Realtime 요청
      console.time('[connect] sdp-exchange');
      const sdpRes = await fetch(STT_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/sdp',
          'OpenAI-Beta': 'realtime=v1',
        },
        body: pc.localDescription!.sdp,
      });

      const raw = await sdpRes.text();
      if (!sdpRes.ok || !raw.startsWith('v=')) {
        console.error('SDP POST 실패:', sdpRes.status, raw.slice(0, 200));
        setConnStatus('idle');
        throw new Error('Realtime SDP 교환 실패');
      }

      await pc.setRemoteDescription({ type: 'answer', sdp: raw });
      console.timeEnd('[connect] sdp-exchange');
      console.timeEnd('[connect] total');
    },
    [cleanup, handleEvent, resetText],
  );

  // ==============================================================
  // ---- prepare  ----
  const prepareAudioTrack = useCallback(async (source: AudioSource) => {
    if (!pcRef.current || !senderRef.current) {
      throw new Error('PeerConnection 없음. 먼저 connect() 호출하세요.');
    }

    setAudioSource(source);
    setCanResume(false);

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

      if (!audio.length)
        throw new Error(
          '탭 오디오를 사용할 수 없습니다. 오디오가 활성화된 탭을 선택하세요.',
        );

      stream = new MediaStream([audio[0]]);
    }

    streamRef.current = stream;
    const [track] = stream.getAudioTracks();
    if (!track) throw new Error('오디오 트랙 없음');

    try {
      if (track && 'contentHint' in track) track.contentHint = 'speech';
    } catch {}

    track.enabled = false; // 송출 x
    await senderRef.current.replaceTrack(track);

    setCanResume(true);
    setRecStatus('prepared');
  }, []);

  // ==============================================================
  // ---- recorder  ----
  const startRecorder = useCallback(async (track: MediaStreamTrack) => {
    if (mediaRecorderRef.current) return;

    const stream = new MediaStream([track]);

    let mime = '';
    if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus'))
      mime = 'audio/webm;codecs=opus';
    else if (MediaRecorder.isTypeSupported('audio/webm')) mime = 'audio/webm';

    const rec = new MediaRecorder(
      stream,
      mime ? { mimeType: mime } : undefined,
    );
    mediaRecorderRef.current = rec;
    recordChunksRef.current = [];

    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordChunksRef.current.push(e.data);
      }
    };
    rec.start(250);
  }, []);

  // ==============================================================
  // ---- resume / pause  ----
  const resumeTranscription = useCallback(async () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (!track) return;

    await startRecorder(track);

    track.enabled = true;

    try {
      mediaRecorderRef.current?.resume();
    } catch {}

    setRecStatus('recording');
  }, [startRecorder]);

  const pauseTranscription = useCallback(() => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) track.enabled = false;

    setRecStatus('paused');
  }, []);

  // ==============================================================
  // ---- flush, stop  ----
  const flushAndStop = useCallback(
    async (opt?: { keepConnection?: boolean }) => {
      const keepConnection = !!opt?.keepConnection;

      // 1. 송출 pause
      try {
        if (streamRef.current?.getAudioTracks()[0]) {
          streamRef.current.getAudioTracks()[0].enabled = false;
        }
      } catch {}

      try {
        mediaRecorderRef.current?.pause();
      } catch {}

      //
      const dc = dcRef.current;
      const pc = pcRef.current;

      // 2. 데이터채널이 없다면 -> 스냅샷 반환
      if (!dc || dc.readyState !== 'open') {
        const audioBlob = await finalizeBlob();
        const text = getTranscriptSnapshot();

        if (!keepConnection) {
          cleanup();
        } else {
          clearStreams();
        }

        return {
          text,
          segments: rawStableData,
          deltas: rawLiveData,
          audioBlob,
        };
      }

      // 3. 커밋 직후 짧게 수집
      const segments: Transcript[] = [];
      const deltas: Delta[] = [];
      let isFinalText = false;

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
            isFinalText = true;
          }
          if (msg.type === 'transcript.final' && msg.text) {
            isFinalText = true;
          }
        } catch {}
      };

      const removeListener = attachDcListener(dc, onMessage);
      try {
        dc.send(JSON.stringify({ type: 'input_audio_buffer.commit' }));
      } catch {}

      await Promise.race([
        waitFinalFlag(() => isFinalText, 1500),
        waitDcClose(pc, dc),
      ]);

      removeListener();

      // 4. 최종 텍스트 조립
      const stableData = [...rawStableData, ...segments];
      const liveData = [...rawLiveData, ...deltas];
      const s = stableData
        .map((v) => v.transcript)
        .join(' ')
        .trim();
      const l = liveData
        .map((v) => v.delta)
        .join('')
        .trim();
      const finalText = s && l ? `${s} ${l}`.trim() : s || l;

      // 5. blob 정리
      const audioBlob = await finalizeBlob();

      // 6. 연결 유지 / 정리
      if (!keepConnection) {
        cleanup();
      } else {
        clearStreams();
      }

      return {
        text: finalText,
        segments: stableData,
        deltas: liveData,
        audioBlob,
      };
    },
    [cleanup, getTranscriptSnapshot, rawLiveData, rawStableData],
  );

  // ==============================================================
  // ---- helpers  ----
  const finalizeBlob = async (): Promise<Blob | null> => {
    const rec = mediaRecorderRef.current;

    if (!rec) return null;

    return await new Promise<Blob>((resolve) => {
      // run
      const run = () => {
        try {
          const blob = new Blob(recordChunksRef.current, {
            type: rec.mimeType || 'audio/webm',
          });
          resolve(blob);
        } catch {
          resolve(new Blob([]));
        } finally {
          recordChunksRef.current = [];
          mediaRecorderRef.current = null;
        }
      };

      // try catch
      try {
        rec.requestData?.();
      } catch {}

      // time
      setTimeout(() => {
        try {
          (rec as any).onstop = run;
          rec.stop();
        } catch {
          run();
        }
      }, 100);
    });
  };

  const clearStreams = () => {
    try {
      streamRef.current?.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
    } finally {
      streamRef.current = null;
      setCanResume(false);
      setRecStatus('idle');
      setConnStatus('connected');
    }
  };

  const attachDcListener = (
    dc: RTCDataChannel,
    onMessage: (e: MessageEvent) => void,
  ) => {
    if ('addEventListener' in dc) {
      dc.addEventListener('message', onMessage as any);

      return () => {
        try {
          dc.removeEventListener('message', onMessage as any);
        } catch {}
      };
    } else {
      const prev = (dc as any).onmessage;

      (dc as any).onmessage = (e: MessageEvent) => {
        prev?.(e);
        onMessage(e);
      };

      return () => {
        try {
          (dc as any).onmessage = prev;
        } catch {}
      };
    }
  };

  const waitFinalFlag = (isDone: () => boolean, timeoutMs: number) => {
    return new Promise<void>((resolve) => {
      const start = performance.now();

      const tick = () => {
        if (isDone()) return resolve();
        if (performance.now() - start > timeoutMs) return resolve();
        setTimeout(tick, 40);
      };

      tick();
    });
  };

  const waitDcClose = (
    pc: RTCPeerConnection | null,
    dc: RTCDataChannel | null,
  ) => {
    return new Promise<void>((resolve) => {
      const check = () => {
        if (!pc || !dc || dc.readyState !== 'open') return resolve();
        setTimeout(check, 60);
      };
      check();
    });
  };

  // ==============================================================
  // ---- switch source  ----
  const switchAudioSource = useCallback(
    async (source: AudioSource) => {
      const pc = pcRef.current;
      const sender = senderRef.current;

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

      try {
        if (newTrack && 'contentHint' in newTrack)
          newTrack.contentHint = 'speech';
      } catch {}

      // 기존 트랙을 교체함.
      await sender.replaceTrack(newTrack);

      try {
        streamRef.current?.getTracks().forEach((t) => {
          try {
            t.stop();
          } catch {}
        });
      } catch (error) {}
      streamRef.current = newStream;

      newTrack.enabled = recStatus === 'recording';
      setAudioSource(source);
    },
    [recStatus],
  );

  // ==============================================================
  // ---- useEffect  ----
  useEffect(() => () => cleanup(), [cleanup]);

  return {
    // 상태
    connStatus,
    recStatus,
    connected: connStatus === 'connected',
    isRecording: recStatus === 'recording',
    canResume,

    // 텍스트
    stable,
    live,
    rawStableData,
    rawLiveData,
    getTranscriptSnapshot,
    resetText,

    // 제어
    connectTranscription,
    prepareAudioTrack,
    resumeTranscription,
    pauseTranscription,
    flushAndStop,
    switchAudioSource,
    stop: cleanup,

    refs: { pcRef, dcRef, streamRef },
  };
};
