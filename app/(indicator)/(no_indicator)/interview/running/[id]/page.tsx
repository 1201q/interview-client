import InterviewClient from '../../_components/InterviewClient';
import { getInterviewSession } from '@/utils/services/question';

interface Props {
  params: Promise<{ id: string }>;
}

const InterviewPage = async ({ params }: Props) => {
  const { id } = await params;

  const data = await getInterviewSession(id);

  return <InterviewClient data={data} />;
};

export default InterviewPage;
