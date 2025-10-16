import ResultClient from '@/components/result/ResultClient';
import ResultHeader from '@/components/result/ResultHeader';
import { getAnalysis } from '@/utils/services/analyses';

const Page = async ({
  params,
}: {
  params: Promise<{ sessionId: string; answerId: string }>;
}) => {
  const { sessionId, answerId } = await params;

  const feedback = await getAnalysis(sessionId, answerId);

  return (
    <>
      <header className="header">
        <ResultHeader
          jobRole={feedback.job_role}
          order={feedback.analyses[0].order}
        />
      </header>
      <div className="contents">
        <ResultClient data={feedback.analyses[0]} answerId={answerId} />
      </div>
    </>
  );
};

export default Page;
