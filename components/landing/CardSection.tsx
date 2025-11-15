import styles from './styles/card.module.css';

import { Check, Video } from 'lucide-react';
import Image from 'next/image';
import { list } from '@vercel/blob';

const CardSection = () => {
  return (
    <section className={styles.cardSection}>
      <div className={styles.contents}>
        <p className={styles.desc}>이런 조건이면 바로 시작해보세요</p>
        <div className={styles.ifWrapper}>
          <div className={styles.ifItem}>
            <Check />
            <p>전공자/비전공자/노베이스로 취업을 준비하고 계신 분</p>
          </div>
          <div className={styles.ifItem}>
            <Check />
            <p>채용 공고에 맞춰 자소서를 빠르게 구조화/맞춤화해야 하는 분</p>
          </div>
          <div className={styles.ifItem}>
            <Check />
            <p>실제 면접관과 실무진 시선에서의 피드백이 필요하신 분</p>
          </div>
        </div>
      </div>
      {/* <>
        <div className={styles.contents}>
          <p className={styles.title}>어려운 면접 준비?</p>
          <p className={styles.desc}>AI와 함께하는 면접 준비로 해결</p>
          <div className={styles.cardGrid}>
            <VideoCard
              title={['이력서와 채용공고면', '맞춤형 면접 질문 생성']}
              desc="이력서/채용공고를 분석해 포지션별 핵심 질문을 자동 생성합니다."
              videoFile="video-1.mp4"
            />
         
          <MotionCard
            title={['인성 면접부터', '기술, 컬처핏 질문까지']}
            desc="역량·경험·컬처핏 영역을 균형 있게 커버하는 질문 세트를 구성합니다."
            Icon={
              <Image
                src={'/card2.png'}
                alt={'card2'}
                width={100}
                height={100}
                sizes="80vw"
                quality={100}
              />
            }
            Icon2={
              <Image
                src={'/card2.png'}
                alt={'card2'}
                width={100}
                height={100}
                sizes="80vw"
                quality={100}
              />
            }
          />

          <MotionCard
            title={['실제 면접과 유사한 환경에서', '면접 대비하기']}
            desc="타이머·카메라·STT 환경으로 실전과 유사한 리허설을 제공합니다."
            Icon={
              <Image
                src={'/card3.png'}
                alt={'card3'}
                width={200}
                height={200}
                sizes="100vw"
                quality={100}
                style={{ marginLeft: '10px' }}
              />
            }
            Icon2={
              <Image
                src={'/card2.png'}
                alt={'card2'}
                width={100}
                height={100}
                sizes="80vw"
                quality={100}
              />
            }
          /> 
          </div>
        </div>
      </> */}
    </section>
  );
};

const MotionCard: React.FC<
  React.PropsWithChildren<{
    colorClass?: string;
    title: [string, string];
    desc: string;
    Icon: any;
    Icon2?: any;
  }>
> = ({ colorClass, title, desc, Icon, Icon2 }) => {
  return (
    <div className={`${styles.card} `}>
      <div className={styles.textWrapper}>
        <p>{title[0]}</p>
        <p>{title[1]}</p>
        <span>{desc}</span>
      </div>
      {/* 아이콘 */}
      <div className={styles.icon}>
        <div className={styles.iconPrimary}>{Icon}</div>
        {Icon2 && <div className={styles.iconSecondary}>{Icon2}</div>}
      </div>
    </div>
  );
};

const VideoCard: React.FC<
  React.PropsWithChildren<{
    title: [string, string];
    desc: string;
    videoFile: string;
  }>
> = ({ title, desc, videoFile }) => {
  return (
    <div className={styles.videoCard}>
      {/* 비디오 레이어 */}
      <div className={styles.videoWrapper}>
        <VideoComponent fileName={videoFile} />
        <div className={styles.cardOverlay} />
      </div>

      {/* 텍스트 오버레이 */}
      <div className={styles.textWrapper}>
        <p>{title[0]}</p>
        <p>{title[1]}</p>
        <span>{desc}</span>
      </div>
    </div>
  );
};

async function VideoComponent({ fileName }: { fileName: string }) {
  const { blobs } = await list({
    prefix: fileName,
    limit: 1,
  });
  const { url } = blobs[0];

  return (
    <video preload="none" loop autoPlay muted aria-label="Video player">
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

export default CardSection;
