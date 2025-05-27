import InterviewClient from '../../_components/InterviewClient';

interface Props {
  params: Promise<{ id: string }>;
}

const InterviewPage = async ({ params }: Props) => {
  const { id } = await params;

  return <InterviewClient sessionId={id} />;
};

export default InterviewPage;
