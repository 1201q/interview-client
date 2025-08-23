import InterviewPipelineClient from '@/components/interview/InterviewPipelineClient';

const TEST_ID = '4e88866e-2a7a-4e66-b49f-12a29e67109e';

const Page = async ({ params }: { params: Promise<{ sessionId: string }> }) => {
  const { sessionId } = await params;

  if (sessionId === '1') {
    return <InterviewPipelineClient sessionId={TEST_ID} />;
  }

  return <InterviewPipelineClient sessionId={sessionId} />;
};

export default Page;
