'use client';

import { QSessionQuestionItem } from '@/utils/types/interview';
import styles from './styles/r.client.module.css';

import { UserCircle2, BotIcon } from 'lucide-react';
import { AnalysisData } from '@/utils/types/analysis';

interface Props {
  data: AnalysisData[];
}

const testText =
  '안녕하세요. 저는 3년간 프론트엔드 개발 경험을 가진 개발자입니다. 주로 React와 TypeScript를 사용하여 사용자 중심의 웹 애플리케이션을 개발해왔습니다. 이전 회사에서는 팀 리더로서 5명의 개발자와 함께 프로젝트를 성공적으로 완료한 경험이 있습니다.';

const ResultClient = ({ data }: Props) => {
  return (
    <div className={styles.main}>
      {data.map((q) => (
        <div className={styles.section} key={q.id}>
          <div className={styles.title}>
            <p className={styles.order}>{q.order + 1}.</p>
            <p className={styles.questionText}>{q.text}</p>
          </div>
          <div className={styles.smallTitle}>
            <UserCircle2 size={16} />
            <p className={styles.smallTitleText}>내 답변</p>
          </div>
          <div className={styles.myAnswer}>
            <p>{q.result.refined.refined.join(' ')}</p>
          </div>
          <div className={styles.smallTitle}>
            <BotIcon size={16} />
            <p className={styles.smallTitleText}>면접관 피드백</p>
          </div>
          <div className={styles.myAnswer}>
            <p>{q.result.feedback.narrative_long}</p>
          </div>

          <div className={styles.smallTitle}>
            <p className={styles.smallTitleText}>세부</p>
          </div>
          {q.result.feedback.summary_sentences.map((s, index) => (
            <div key={`${s.axis}-${index}`} className={styles.axis}>
              <div className={styles.axisTitle}>
                <p className={styles.axisTitleText}>{s.criterion}</p>
                <p className={styles.axisTitleIntent}>{s.intent}</p>
              </div>
              <div className={styles.evidenceList}>
                {s.evidence.map((e, index) => (
                  <div className={styles.evidence} key={e}>
                    {e}
                  </div>
                ))}
              </div>
              <div className={styles.myAnswer}>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ResultClient;
