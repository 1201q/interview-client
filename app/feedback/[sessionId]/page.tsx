import ResultClient from '@/components/result/ResultClient';
import { getAnalysis } from '@/utils/services/analyses';

const Page = async ({
  params,
}: {
  params: Promise<{ sessionId: string; answerId: string }>;
}) => {
  const { sessionId, answerId } = await params;

  // const feedback = await getAnalysis(sessionId, answerId);

  return <>1</>;
};

export default Page;
