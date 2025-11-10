'use client';

import styles from './styles/card.module.css';

import Card from '@/public/card.svg';
import Card2 from '@/public/card2.svg';
import Card3 from '@/public/card3.svg';

import { useState } from 'react';

import { motion } from 'motion/react';

const CardSection = () => {
  return (
    <section className={styles.cardSection}>
      <motion.div className={styles.contents}>
        <p className={styles.title}>AI와 함께하는 면접 준비</p>
        <div className={styles.cardGrid}>
          <MotionCard
            colorClass={styles['card--blue']}
            title={[
              '이력서와 채용공고면 나에게 딱 맞는',
              '맞춤형 면접 질문 생성',
            ]}
            desc="이력서/채용공고를 분석해 포지션별 핵심 질문을 자동 생성합니다."
            Icon={Card}
          />

          <MotionCard
            colorClass={styles['card--cyan']}
            title={['인성 면접부터', '기술, 컬처핏 질문까지']}
            desc="역량·경험·컬처핏 영역을 균형 있게 커버하는 질문 세트를 구성합니다."
            Icon={Card2}
          />

          <MotionCard
            colorClass={styles['card--indigo']}
            title={['실제 면접과 유사한 환경에서', '면접 대비하기']}
            desc="타이머·카메라·STT 환경으로 실전과 유사한 리허설을 제공합니다."
            Icon={Card3}
          />
        </div>
      </motion.div>
    </section>
  );
};

const MotionCard: React.FC<
  React.PropsWithChildren<{
    colorClass: string;
    title: [string, string];
    desc: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  }>
> = ({ colorClass, title, desc, Icon }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded((prev) => !prev)}
      className={`${styles.card} ${colorClass}`}
    >
      <p>{title[0]}</p>
      <p>{title[1]}</p>

      {/* 아이콘 */}
      <div className={styles.icon}>
        <Icon />
      </div>
    </div>
  );
};

export default CardSection;
