import SelectPage from '@/components/beforeInterview/SelectPage';
import InterviewPipelineClient from '@/components/interview/InterviewPipelineClient';
import { GeneratedQuestionItem } from '@/utils/types/types';

const TEST_ID = '4e88866e-2a7a-4e66-b49f-12a29e67109e';

const Page = async ({ params }: { params: Promise<{ sessionId: string }> }) => {
  const { sessionId } = await params;

  return <InterviewPipelineClient />;
};

export default Page;
