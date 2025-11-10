'use client';

import { AnalysisItem } from '@/utils/types/analysis';
import styles from './styles/r.client.module.css';

import {
  QuoteIcon,
  ClipboardCheckIcon,
  InfoIcon,
  SearchCheckIcon,
  SearchXIcon,
  SmileIcon,
} from 'lucide-react';

import TopInfo from './TopInfo';
import VoicePlayer from './VoicePlayer';
import VoiceResult from './VoiceResult';
import FaceResult from './FaceResult';
import MenuTabs from './MenuTabs';
import { useState } from 'react';
import { motion } from 'motion/react';

interface ResultClientProps {
  data: AnalysisItem;
  answerId: string;
}

const tabs = [
  { key: 'answer-feedback', label: '답변 / 피드백' },
  { key: 'info', label: '질문 정보' },
  { key: 'nonverbal', label: '비언어 요소 분석' },
];

const ResultClient = ({ data, answerId }: ResultClientProps) => {
  const hasMisconception = data.feedback?.misconception;

  const [active, setActive] = useState<
    'info' | 'nonverbal' | 'answer-feedback'
  >('answer-feedback');

  return (
    <div className={styles.main}>
      {/* 상단 정보 */}
      <div className={`${styles.question}`}>
        <h1>
          <span className={styles.orderText}>{data.order + 1}.</span>
          <span className={styles.questionText}>{data.question_text}</span>
        </h1>
      </div>
      <MenuTabs
        answerId={answerId}
        tabs={tabs}
        onTabClick={(key) => setActive(key)}
        activeTab={active}
      />
      {/* 아래 컨텐츠 */}
      <div className={styles.contents}>
        {active === 'answer-feedback' && (
          <>
            {/* 나의 답변 */}
            <section className={styles.column}>
              <div className={`${styles.sectionTitle}`}>
                <QuoteIcon
                  className={`${styles.blueText}`}
                  style={{ marginTop: '2px' }}
                />
                <h3 className={`${styles.blueText}`}>나의 답변</h3>
              </div>

              <VoicePlayer
                rawSegments={data.answer.segments}
                answerId={answerId}
              />
            </section>
            {/* 피드백 */}
            <section className={styles.column}>
              <div className={`${styles.sectionTitle}`}>
                <ClipboardCheckIcon
                  style={{ marginTop: '1px' }}
                  className={`${styles.greenText}`}
                />
                <h3 className={`${styles.greenText}`}>면접관 피드백</h3>
              </div>
              <div className={styles.container}>
                <div className={styles.topOneLine}>
                  <p>{data.feedback?.one_line}</p>
                </div>
                <div className={styles.feedback}>{data.feedback?.feedback}</div>
              </div>
            </section>
            {/* 오개념 */}
            <section className={styles.column}>
              <div className={`${styles.sectionTitle}`}>
                {hasMisconception ? (
                  <SearchXIcon
                    className={`${hasMisconception ? styles.redText : styles.greenText}`}
                  />
                ) : (
                  <SearchCheckIcon
                    className={`${hasMisconception ? styles.redText : styles.greenText}`}
                  />
                )}
                <h3
                  className={`${hasMisconception ? styles.redText : styles.greenText}`}
                >
                  오개념 분석
                </h3>
              </div>
              {/* 오개념 존재 여부에 따라 렌더링 */}
              {hasMisconception ? (
                <div className={`${styles.container}`}>
                  <div className={`${styles.misconception}`}>
                    {data.feedback?.misconception?.summary}
                  </div>
                  <div className={styles.yourAnswer}>
                    <span>{data.feedback?.misconception?.evidence}</span>
                  </div>
                  <div className={styles.feedback}>
                    {data.feedback?.misconception?.explanation}
                  </div>
                </div>
              ) : (
                <div className={styles.container}>
                  <div
                    className={`${styles.topOneLine} ${styles.dontMisconception}`}
                  >
                    답변에 오개념이 없습니다.
                  </div>
                </div>
              )}
            </section>
          </>
        )}
        {active === 'info' && (
          <>
            <section className={styles.column}>
              <div className={`${styles.sectionTitle}`}>
                <InfoIcon
                  className={styles.defaultText}
                  style={{ marginTop: '2px' }}
                />
                <h3 className={styles.defaultText}>질문 정보</h3>
              </div>
              <TopInfo rubric={data.rubric} />
            </section>
          </>
        )}
        {active === 'nonverbal' && (
          <>
            {/* 음성 발화 */}
            <section className={styles.column}>
              <div className={`${styles.sectionTitle}`}>
                <QuoteIcon
                  className={`${styles.defaultText}`}
                  style={{ marginTop: '2px' }}
                />
                <h3 className={`${styles.defaultText}`}>음성 분석</h3>
              </div>
              {data.voice && <VoiceResult data={data.voice} />}
            </section>
            {/* 얼굴 */}
            <section className={styles.column}>
              <div className={`${styles.sectionTitle}`}>
                <SmileIcon
                  className={`${styles.defaultText}`}
                  style={{ marginTop: '2px' }}
                />
                <h3 className={`${styles.defaultText}`}>시선 / 표정 분석</h3>
              </div>
              {data.face && <FaceResult data={data.face} />}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultClient;
