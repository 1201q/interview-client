'use client';

import { useRef, useState } from 'react';
import styles from './page.module.css';

const CameraPage = () => {
  const [recording, setRecording] = useState(false);
  const [text, setText] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // 녹음 시작
  const startRecording = async () => {
    setText('');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
      }
    };

    mediaRecorder.start();
    setRecording(true);
  };

  // 녹음 종료
  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;
    setText('로딩중');
    mediaRecorderRef.current.stop();

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/stt/upload`,
          {
            method: 'POST',
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error('STT 서버 요청 실패');
        }

        const data = await response.json();

        console.log(data);
        setText(data.text);
      } catch (error) {
        console.error('에러 발생:', error);
      } finally {
        setRecording(false);
      }
    };
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}></div>
      <div className={`${styles.contentsContainer}`}>
        <div style={{ marginTop: 20 }}>
          <h2>📝 변환 결과</h2>
          <p>{text || '텍스트가 여기에 표시됩니다.'}</p>
        </div>
      </div>
      <div className={styles.bottomContainer}>
        {!recording && (
          <button onClick={startRecording} disabled={recording}>
            녹음 시작
          </button>
        )}
        <button onClick={stopRecording} disabled={!recording}>
          녹음 종료
        </button>
      </div>
    </div>
  );
};

export default CameraPage;
