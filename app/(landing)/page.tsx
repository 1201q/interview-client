import styles from './page.module.css';

import Test from '@/public/card.svg';
import Card2 from '@/public/card2.svg';
import Card3 from '@/public/card3.svg';

import Image from 'next/image';

import LandingHeader from '@/components/landing/LandingHeader';
import Link from 'next/link';
import { getAuth } from '@/utils/services/auth';
import { cookies } from 'next/headers';

const Page = async () => {
  const auth = await getAuth();
  const cookie = await cookies();
  const refreshToken = cookie.get('refreshToken')?.value;

  const isLoggedIn = Boolean(auth.user && refreshToken);

  return (
    <div className={styles.container}>
      <LandingHeader isLoggedIn={isLoggedIn} />
      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.deco}>
            <div className={styles.deco1}></div>
            <div className={styles.deco2}></div>
            <div className={styles.deco3}></div>
            <div className={styles.deco4}></div>
            <div className={styles.deco5}></div>
          </div>
          <div className={styles.bannerContainer}>
            <div className={styles.bannerWrapper}>
              <div className={styles.banner}>
                <h1 className={styles.title}>AI.terview</h1>
                <p className={styles.desc}>AI로 면접 합격까지</p>
              </div>
            </div>
            <div className={styles.buttons}>
              {isLoggedIn ? (
                <Link href="/new-request">
                  <button className={styles.button}>서비스로 이동하기</button>
                </Link>
              ) : (
                <Link href="/login">
                  <button className={styles.button}>무료로 이용하기</button>
                </Link>
              )}
            </div>
          </div>
        </section>
        <section className={styles.cardSection}>
          <div className={styles.contents}>
            <p className={styles.title}>AI와 함께하는 면접 준비</p>
            <div className={styles.cardGrid}>
              <div className={`${styles.card} ${styles['card--blue']}`}>
                <p>이력서와 채용공고면 나에게 딱 맞는</p>
                <p> 맞춤형 면접 질문 생성</p>
                <div className={styles.icon}>
                  <Test />
                </div>
              </div>
              <div className={`${styles.card} ${styles['card--cyan']}`}>
                <p>인성 면접부터</p>
                <p>기술, 컬처핏 질문까지</p>
                <div className={styles.icon}>
                  <Card2 />
                </div>
              </div>
              <div className={`${styles.card} ${styles['card--indigo']}`}>
                <p>실제 면접과 유사한 환경에서</p>
                <p>면접 대비하기</p>
                <div className={styles.icon}>
                  <Card3 />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.infoSection}>
          <div className={`${styles.contents} ${styles.infoContents}`}>
            <div className={styles.info}>
              <div className={styles.infoImage}>
                <Image
                  src={'/생성.png'}
                  alt="스크린샷"
                  width={400}
                  height={340}
                />
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
                <Image
                  src={'/생성.png'}
                  alt="스크린샷"
                  width={400}
                  height={340}
                />
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
                <Image
                  src={'/생성.png'}
                  alt="스크린샷"
                  width={400}
                  height={340}
                />
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
      </main>
    </div>
  );
};

export default Page;
