'use client';

import styles from './styles/mic.module.css';
import MicSlash from '@/public/mic-slash.svg';
import MicWhite from '@/public/mic-white.svg';
import { useStt } from './hooks/useStt';
import Loading from '@/components/common/Loading';
import { useEffect } from 'react';

interface Props {
  displayNextButton: () => void;
}

const MicTestComponent = ({ displayNextButton }: Props) => {
  const { startRecording, stopRecording, isLoading, isRecording, text } =
    useStt();

  const success = (text: string) =>
    text?.replaceAll(' ', '').startsWith('안녕하세요');

  useEffect(() => {
    if (text && success(text)) {
      displayNextButton();
    }
  }, [text]);

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <button
          disabled={isLoading}
          className={`${isRecording ? styles.red : styles.blue}`}
          onClick={() => {
            if (!isRecording) {
              startRecording();
            } else {
              stopRecording();
            }
          }}
        >
          {isLoading && <Loading size={35} color={'white'} />}
          {!isLoading && isRecording && <MicSlash />}
          {!isLoading && !isRecording && <MicWhite />}
        </button>
      </div>
      <div className={styles.sttContainer}>
        {!isRecording && !text && (
          <>
            <p>마이크를 통해</p>
            <p>&apos;안녕하세요&apos; 라고 말해보세요.</p>
          </>
        )}
        {!isLoading && isRecording && (
          <p>&apos;안녕하세요&apos; 라고 말해보세요.</p>
        )}
        {isLoading && <p>분석중....</p>}
        {!isLoading && !isRecording && text && <span>{text}</span>}
      </div>
      <div>
        <p className={styles.text}>
          마이크를 켜고 &quot;안녕하세요&quot;라고 말해보세요.
        </p>
        <p className={styles.text}>인식되면 다음 단계로 넘어갑니다.</p>
      </div>
    </div>
  );
};

export default MicTestComponent;
