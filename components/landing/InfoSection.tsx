'use client';

import styles from './styles/info.module.css';

import Image from 'next/image';

const InfoSection = () => {
  return (
    <section className={styles.infoSection}>
      <div className={`${styles.contents} ${styles.infoContents}`}>
        <div className={styles.info}>
          <div className={styles.infoImage}>
            <Image src={'/생성.png'} alt="스크린샷" width={400} height={340} />
          </div>
          <div className={styles.infoRight}>
            <div className={styles.infoBadge}>질문 생성</div>

            <div className={styles.bigText}>
              <p>세상에서 하나뿐인</p>
              <p>당신만의 면접 질문을 생성하세요</p>
            </div>
            <div className={styles.smallText}>
              <p>이력서와 채용공고로</p>
              <p>실전 준비에 도움이 되는 질문을 드립니다</p>
            </div>
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.infoImage}>
            <Image src={'/생성.png'} alt="스크린샷" width={400} height={340} />
          </div>
          <div className={styles.infoRight}>
            <div className={styles.infoBadge}>면접 진행</div>

            <div className={styles.bigText}>
              <p>실제 면접과 같은 환경에서</p>
              <p>면접을 연습하세요</p>
            </div>
            <div className={styles.smallText}>
              <p>원하는 면접 질문을 선택하고</p>
              <p>차근차근 답변해보세요</p>
              <p>답변의 음성과 집중도까지 분석해드려요</p>
            </div>
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.infoImage}>
            <Image src={'/생성.png'} alt="스크린샷" width={400} height={340} />
          </div>
          <div className={styles.infoRight}>
            <div className={styles.infoBadge}>답변 피드백</div>

            <div className={styles.bigText}>
              <p>AI에게 답변에 대한</p>
              <p>자세한 분석결과를 받아보세요</p>
            </div>
            <div className={styles.smallText}>
              <p>내 답변의 장단점과 개선점을 제공합니다</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
