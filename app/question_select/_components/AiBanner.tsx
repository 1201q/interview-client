import styles from './styles/side.info.module.css';
import ChatGpt from '@/public/openai.svg';

const AiBanner = () => {
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.leftContainer}>
        <ChatGpt />
        <p>AI로 질문 생성하기</p>
      </div>
    </div>
  );
};

export default AiBanner;
