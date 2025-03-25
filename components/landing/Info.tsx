import styles from './styles/info.module.css';
import Capture from '@/public/capture.svg';
import Microphone from '@/public/microphone.svg';
import Bookmark from '@/public/file-bookmark-alt.svg';
import Cloud from '@/public/cloud.svg';

const Info = () => {
  return (
    <div className={styles.container}>
      <div className={styles.gridContainer}>
        <div className={styles.gridInfoContainer}>
          <Cloud />
          <p>AI 분석</p>
          <span>
            실시간으로 당신의 답변을 AI가 평가하고 맥락을 이해하여 피드백을
            제공해요.
          </span>
        </div>
        <div className={styles.gridInfoContainer}>
          <Capture />
          <p>얼굴 분석</p>
          <span>시선, 표정, 집중도 등 다양한 분석 결과를 제공해요.</span>
        </div>
        <div className={styles.gridInfoContainer}>
          <Microphone />
          <p>목소리 분석</p>
          <span>
            목소리를 자동으로 인식해, 텍스트화하고, 음성에 실린 내용에 대해
            분석해요.
          </span>
        </div>
        <div className={styles.gridInfoContainer}>
          <Bookmark />
          <p>개인화</p>
          <span>진행했던 면접 과정을 다시 복기하며 연습할 수 있어요.</span>
        </div>
      </div>
    </div>
  );
};

export default Info;
