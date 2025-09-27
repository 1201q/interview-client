'use client';

import WebcamInstance from '../refactorWebcam/WebcamInstance';
import InterviewSubmitButton from './InterviewSubmitButton';

import styles from './styles/i.client.module.css';

const InterviewClient = () => {
  const cameraOn = true;
  return (
    <div className={styles.main}>
      <div className={styles.camera}>
        <WebcamInstance isRunning={cameraOn} drawTargets={{}} />
        <InterviewSubmitButton
          phase={'start'}
          startAnswer={() => {}}
          submitAnswer={async () => {}}
          startCountdown={async () => {}}
          startInterview={async () => {}}
        />
      </div>
      <div className={styles.controller}>
        <div className={styles.questionOrder}>질문1</div>
        <p className={styles.questionText}>
          예약 시스템에서 발생한 동시성 문제를 Redis와 Redisson을 이용해
          해결하셨다고 했습니다. 그 과정에서 예상 외의 장애나 데이터 불일치가
          발생했던 경험이 있다면, 어떻게 대응하셨는지 구체적으로 말씀해 주세요.
        </p>
      </div>
    </div>
  );
};

export default InterviewClient;
