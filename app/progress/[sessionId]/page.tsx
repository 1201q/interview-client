import InterviewClient from '@/components/progress/InterviewClient';
import InterviewSidebar from '@/components/progress/InterviewSidebar';
import { getInterviewSessionDetail } from '@/utils/services/interviewSession';

const TEST_ID = '4e88866e-2a7a-4e66-b49f-12a29e67109e';

const Page = async ({ params }: { params: Promise<{ sessionId: string }> }) => {
  const { sessionId } = await params;

  const data = await getInterviewSessionDetail(sessionId);

  return (
    <>
      <aside className="sidebar">
        <InterviewSidebar questions={data.questions} status={data.status} />
      </aside>
      <main className="main">{<InterviewClient />}</main>
    </>
  );
};

export default Page;
