import { getInterviewSessionDetail } from '@/utils/services/interviewSession';
import { redirect } from 'next/navigation';
import InterviewInit from './_init';

const Page = async ({ params }: { params: Promise<{ sessionId: string }> }) => {
  const { sessionId } = await params;

  const data = await getInterviewSessionDetail(sessionId);

  if (data && data.status === 'in_progress') {
    redirect(`/progress/${sessionId}/reset`);
  }

  if (data && data.status === 'completed') {
    const error = new Error('completed');
    throw error;
  }

  if (data && data.status === 'expired') {
    const error = new Error('expired');
    throw error;
  }

  console.log(data);

  return (
    <InterviewInit
      sessionId={sessionId}
      questions={data.questions}
      status={data.status}
    />
  );
};

export default Page;
