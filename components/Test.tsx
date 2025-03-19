'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

function Test() {
  const [voiceText, setVoiceText] = useState('');
  const [isTalking, setIsTalking] = useState(false);
  const socket = useRef<Socket | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const processor = useRef<AudioWorkletNode | null>(null);
  const audioChunks = useRef<Uint8Array[]>([]);

  useEffect(() => {
    // Socket 연결
    socket.current = io('http://localhost:8000', {
      transports: ['websocket'], // WebSocket만 사용
    });

    socket.current.on('connect', () => {
      console.log('Socket.IO Connected:', socket.current?.id);
    });

    socket.current.on('transcript', (data) => {
      setVoiceText(data.transcript);
    });

    socket.current.on('error', (error) => {
      console.error('Socket.IO 오류:', error);
      setVoiceText('');
    });

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  const closeWebSocket = () => {
    socket.current?.disconnect();
  };

  const setupWebSocket = async () => {
    closeWebSocket();

    socket.current = io('http://localhost:8000', {
      transports: ['websocket'],
    });

    socket.current.on('connect', () => {
      console.log('Socket.IO 연결됨:', socket.current?.id);
    });

    try {
      const sampleRate = 16000;
      const chunkRate = 100;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: sampleRate,
          channelCount: 1,
          echoCancellation: true,
        },
      });

      mediaRecorder.current = new MediaRecorder(stream);
      audioContext.current = new AudioContext({ sampleRate: sampleRate });

      await audioContext.current.audioWorklet.addModule(
        './linear16-processor.js',
      );

      const source = audioContext.current.createMediaStreamSource(stream);
      processor.current = new AudioWorkletNode(
        audioContext.current,
        'linear16-processor',
      );

      processor.current.port.onmessage = (event) => {
        if (socket.current && socket.current.connected) {
          socket.current.emit('test', event.data);
          audioChunks.current.push(
            new Int16Array(event.data) as unknown as Uint8Array,
          );
        }
      };

      const analyser = audioContext.current.createAnalyser();
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      source.connect(processor.current);
      processor.current.connect(audioContext.current.destination);
      source.connect(analyser);

      const detectTalking = () => {
        if (!socket.current || !socket.current.connected) {
          return;
        }

        analyser.getByteFrequencyData(dataArray);
        const avgVolume =
          dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

        setIsTalking(avgVolume > 50);
        requestAnimationFrame(detectTalking);
      };

      detectTalking();

      mediaRecorder.current.onstop = () => {
        if (processor.current && audioContext.current) {
          stream.getTracks().forEach((track) => track.stop());
          source.disconnect(processor.current);
          processor.current.disconnect(audioContext.current.destination);
        }
      };

      mediaRecorder.current.start(chunkRate);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button onClick={setupWebSocket}>듣기</button>
      <button onClick={closeWebSocket}>멈추기</button>
      <br />
      <div>{voiceText}</div>
      {isTalking && <div>말하는중</div>}
    </>
  );
}

export default Test;
