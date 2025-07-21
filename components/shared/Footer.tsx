import Link from 'next/link';
import styles from './styles/footer.module.css';
import Github from '@/public/github.svg';
import { BotIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.contents}>
        <div className={styles.topInfoContainer}>
          <div className={styles.logoContainer}>
            <BotIcon width={23} height={23} />
            <p>Ai Interview</p>
          </div>
          <div className={styles.siteMapMenuContainer}>
            <p>AI 면접 연습</p>
            <p>질문 생성</p>
            <p>면접 분석</p>
            <p>피드백</p>
          </div>
        </div>
        <div className={styles.bottomInfoContainer}>
          <p>© 2025 Ai Interview. All rights reserved.</p>
          <Link href={'https://chatgpt.com/'}>
            <Github />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
