'use client';

import MicSlash from '@/public/mic-slash.svg';
import MicWhite from '@/public/mic-white.svg';
import { useStt } from './hooks/useStt';
import Loading from '@/components/common/Loading';
import PageHeader from './PageHeader';
import styles from './styles/mic.check.module.css';

const MicCheck = () => {
  const { startRecording, stopRecording, isLoading, isRecording, text } =
    useStt();

  const success = (text: string) =>
    text?.replaceAll(' ', '').startsWith('안녕하세요');

  return (
    <>
      <PageHeader
        titleText="마이크 체크"
        subtitleText="마이크가 목소리를 제대로 인식하는지 확인하는 단계에요. '안녕하세요' 라고 말해보세요."
      />
      <div className={styles.container}>
        <div className={styles.textContainer}>
          {isRecording && <p>듣는중...</p>}
          {!isRecording && !text && (
            <>
              {/* <p>안녕하세요</p> */}
              <span>아래 버튼을 누르고 말해보세요.</span>
            </>
          )}
          {text && !success(text) && (
            <>
              <p>제대로 인식하지 못했어요</p>
              <span>안녕하세요 라고 다시 말해보세요.</span>
            </>
          )}
        </div>

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
      </div>
    </>
  );
};

export default MicCheck;
