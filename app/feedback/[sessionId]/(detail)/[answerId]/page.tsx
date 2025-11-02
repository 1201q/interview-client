import ResultClient from '@/components/result/ResultClient';
import ResultHeader from '@/components/result/ResultHeader';
import { getAnalysis } from '@/utils/services/analyses';
import { Suspense } from 'react';
import SkeletonTop from './loading';

const Page = async ({
  params,
}: {
  params: Promise<{ sessionId: string; answerId: string }>;
}) => {
  const { sessionId, answerId } = await params;

  const feedback = await getAnalysis(sessionId, answerId);

  return (
    <div className="main" key={answerId}>
      <header className="header">
        <ResultHeader
          jobRole={feedback.job_role}
          order={feedback.analyses[0].order}
        />
      </header>
      <div className="contents">
        <Suspense fallback={<SkeletonTop />}>
          <ResultClient data={feedback.analyses[0]} answerId={answerId} />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
