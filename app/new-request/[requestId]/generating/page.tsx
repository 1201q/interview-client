import GeneratingClient from '@/components/newRequest/GeneratingClient';

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
      <GeneratingClient requestId={requestId} />
    </Suspense>
  );
};

export default Page;
