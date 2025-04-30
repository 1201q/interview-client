import Link from 'next/link';
import styles from './styles/side.info.module.css';
import ChatGpt from '@/public/openai.svg';

const AiBanner = () => {
  return (
    <Link href={'/question_generate'}>
      <div className={styles.bannerContainer}>
        <div className={styles.leftContainer}>
          <ChatGpt />
          <p>AI로 질문 생성하기</p>
        </div>
      </div>
    </Link>
  );
};

export default AiBanner;
