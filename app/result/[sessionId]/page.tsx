import ResultSidebar from '@/components/result/ResultSidebar';
import {
  getAnalysis,
  getInterviewSessionDetail,
} from '@/utils/services/interviewSession';
import { redirect } from 'next/navigation';
import ResultInit from './_init';

const Page = async ({ params }: { params: Promise<{ sessionId: string }> }) => {
  const { sessionId } = await params;

  const data = await getInterviewSessionDetail(sessionId);

  const result = await getAnalysis(sessionId);

  // if (data && data.status === 'in_progress') {
  //   redirect(`/progress/${sessionId}/reset`);
  // }

  // if (data && data.status === 'completed') {
  //   const error = new Error('completed');
  //   throw error;
  // }

  // if (data && data.status === 'expired') {
  //   const error = new Error('expired');
  //   throw error;
  // }
  console.log(result);

  return <ResultInit result={result} questions={data.questions} />;
};

export default Page;
