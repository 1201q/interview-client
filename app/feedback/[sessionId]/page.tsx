import ResultClient from '@/components/result/ResultClient';
import { getAnalysis } from '@/utils/services/analyses';

const Page = async ({
  params,
}: {
  params: Promise<{ sessionId: string; answerId: string }>;
}) => {
  return <>1</>;
};

export default Page;
