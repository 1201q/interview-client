import styles from './styles/introduce.module.css';
import { list } from '@vercel/blob';

const IntroduceSection = () => {
  return (
    <section className={styles.cardSection}>
      <div className={styles.contents}>
        <div className={styles.leftContents}>
          <p>{'이력서와 채용공고면'}</p>
          <p>{'맞춤형 면접 질문 생성'}</p>
          <span>
            {'이력서/채용공고를 분석해 포지션별 핵심 질문을 자동 생성합니다.'}
          </span>
        </div>
        <div className={styles.rightContents}>
          <div className={styles.videoWrapper}>
            <VideoComponent fileName="video-1.mp4" />
          </div>
        </div>
      </div>
    </section>
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

export default IntroduceSection;
