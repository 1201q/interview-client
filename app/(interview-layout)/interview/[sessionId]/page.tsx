import InterviewPipelineClient from '@/components/interview/InterviewPipelineClient';
import { getInterviewSessionDetail } from '@/utils/services/interviewSession';

const TEST_ID = '4e88866e-2a7a-4e66-b49f-12a29e67109e';

const Page = async ({ params }: { params: Promise<{ sessionId: string }> }) => {
  const { sessionId } = await params;

  if (sessionId === '1') {
    return <InterviewPipelineClient sessionId={TEST_ID} />;
  }

  const detail = await getInterviewSessionDetail(sessionId);

  console.log(detail);

  return <InterviewPipelineClient sessionId={sessionId} />;
};

export default Page;
