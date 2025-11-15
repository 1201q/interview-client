import GeneratingClient from '@/components/newRequest/GeneratingClient';
import RequestHeader from '@/components/newRequest/RequestHeader';
import { Suspense } from 'react';
import GeneratingSkeleton from './loading';

import { getRequestStatus } from '@/utils/services/generate-request';

const Page = async ({ params }: { params: Promise<{ requestId: string }> }) => {
  const { requestId } = await params;

  const status = await getRequestStatus(requestId);

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await wait(2000);

  return (
    <Suspense fallback={<GeneratingSkeleton />}>
      <header className="header">
        <RequestHeader text={'Step 3/4'} />
      </header>
      <div className="contents">
        <GeneratingClient requestId={requestId} />
      </div>
    </Suspense>
  );
};

export default Page;
