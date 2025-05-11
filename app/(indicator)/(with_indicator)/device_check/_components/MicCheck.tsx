'use client';

import MicSlash from '@/public/mic-slash.svg';
import MicWhite from '@/public/mic-white.svg';
import { useStt } from './hooks/useStt';
import Loading from '@/components/common/Loading';

import styles from './styles/mic.check.module.css';
import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { micCheckCompletedAtom } from '@/store/step';

const MicCheck = () => {
  const { startRecording, stopRecording, isLoading, isRecording, text } =
    useStt();

  const [completed, setCompleted] = useAtom(micCheckCompletedAtom);

  const success = (text: string) =>
    text?.replaceAll(' ', '').startsWith('안녕하세요');

  const isSuccess = text !== null && success(text);

  useEffect(() => {
    if (isSuccess) {
      setCompleted(true);
    }
  }, [isSuccess]);

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        {isRecording && <p>듣는중...</p>}
        {!completed && !isRecording && !text && (
          <>
            <span>아래 버튼을 누르고 말해보세요.</span>
          </>
        )}
        {!completed && text && !success(text) && (
          <>
            <p>제대로 인식하지 못했어요</p>
            <span>안녕하세요 라고 다시 말해보세요.</span>
          </>
        )}
        {(completed || (text && success(text))) && (
          <>
            <p>인식성공!</p>
            <span>다음 단계로 넘어가세요.</span>
          </>
        )}
      </div>
      {!completed && (
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
      )}
    </div>
  );
};

export default MicCheck;
