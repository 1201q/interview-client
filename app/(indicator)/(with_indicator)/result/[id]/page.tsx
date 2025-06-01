import { getInterviewSessionServer } from '@/utils/services/question';
import { redirect } from 'next/navigation';
import InfoContainer from './components/InfoContainer';

import styles from './page.module.css';

import AnswerResultContainer from './components/AnswerResultContainer';
import AnswerTextFeedback from './components/AnswerTextFeedback';
import AnswerCommunicationFeedback from './components/AnswerCommunicationFeedback';

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
        {data.questions.map((q) => (
          <div className={styles.analysisContainer} key={q.id}>
            <AnswerResultContainer data={q} />
            <InfoContainer headerTitle="답변 내용 피드백">
              <AnswerTextFeedback />
            </InfoContainer>
          </div>
        ))}
        <InfoContainer headerTitle="비언어적 정보 피드백">
          <AnswerCommunicationFeedback />
        </InfoContainer>
      </div>
    </div>
  );
};

export default ResultPage;
