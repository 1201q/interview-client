import { getInterviewSessionServer } from '@/utils/services/question';
import { redirect } from 'next/navigation';
import InfoContainer from './components/InfoContainer';

import styles from './page.module.css';

import AnswerResultContainer from './components/AnswerResultContainer';
import AnswerTextFeedback from './components/AnswerTextFeedback';
import AnswerCommunicationFeedback from './components/AnswerCommunicationFeedback';
import { AnalysisResult } from '@/utils/types/types';
import { dayjsFn } from '@/utils/libs/dayjs';
import AnswerResult from './components/AnswerResult';

interface Props {
  params: Promise<{ id: string }>;
}

const ResultPage = async ({ params }: Props) => {
  const { id } = await params;

  const data = await getInterviewSessionServer(id);

  if (data.status !== 'completed') {
    redirect('/question_select');
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentsContainer}>
        {data.questions.map((q) => {
          const analysisData: AnalysisResult = JSON.parse(q.analysis_result);

          const time = dayjsFn(dayjsFn(q?.ended_at).diff(q?.started_at)).format(
            's',
          );

          return (
            <div className={styles.analysisContainer} key={q.id}>
              <InfoContainer
                headerTitle={`질문 ${q.order + 1}`}
                subtitle={`소요시간: ${time}초`}
              >
                <AnswerResult selected={q} />
              </InfoContainer>

              <InfoContainer headerTitle="답변 내용 피드백">
                <AnswerTextFeedback data={analysisData.feedback} />
              </InfoContainer>
            </div>
          );
        })}
        <InfoContainer headerTitle="비언어적 정보 피드백">
          <AnswerCommunicationFeedback />
        </InfoContainer>
      </div>
    </div>
  );
};

export default ResultPage;
