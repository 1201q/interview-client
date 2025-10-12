import ResultClient from '@/components/result/ResultClient';
import { getAnalyesStatuses, getAnalysis } from '@/utils/services/analyses';

const Page = async ({
  params,
}: {
  params: Promise<{ sessionId: string; answerId: string }>;
}) => {
  const { sessionId, answerId } = await params;

  // const time = await new Promise((resolve) => setTimeout(resolve, 2000));

  const feedback = await getAnalysis(sessionId, answerId);

  console.log(feedback.analyses[0]);
  return <ResultClient data={feedback.analyses[0]} />;
};

export default Page;
