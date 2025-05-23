import { getInterviewSessionServer } from '@/utils/services/question';
import { redirect } from 'next/navigation';
import InfoContainer from './components/InfoContainer';

import styles from './page.module.css';
import AnswerList from './components/AnswerList';
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

  // 44a8685a-06f4-4d0f-81c3-4c5fa124bdec

  return (
    <div className={styles.container}>
      <div className={styles.contentsWrapper}>
        <div className={styles.sideContainer}>
          <InfoContainer
            headerTitle="질문 목록"
            subtitle={`질문 ${data.questions.length}개`}
          >
            <AnswerList data={data.questions} />
          </InfoContainer>
        </div>
        <div className={styles.contentsContainer}>
          <AnswerResultContainer />
          <InfoContainer headerTitle="답변 내용 피드백">
            <AnswerTextFeedback />
          </InfoContainer>
          <InfoContainer
            headerTitle="비언어적 정보 피드백"
            subtitle="음성, 시선, 표정 등의 분석결과에요."
          >
            <AnswerCommunicationFeedback />
          </InfoContainer>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
