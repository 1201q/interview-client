import GeneratingClient from '@/components/newRequest/GeneratingClient';

import { Suspense } from 'react';
import GeneratingSkeleton from './loading';

import { getRequestStatus } from '@/utils/services/generate-request';
import { notFound } from 'next/navigation';
import SoftRedirect from '@/components/shared/SoftRedirect';

const Page = async ({ params }: { params: Promise<{ requestId: string }> }) => {
  const { requestId } = await params;

  let data: Awaited<ReturnType<typeof getRequestStatus>>;

  try {
    data = await getRequestStatus(requestId);
  } catch (error: any) {
    if (error?.status === 404) notFound();
    throw new Error('REQUEST_FAILED');
  }

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await wait(2000);

  if (data.status === 'completed') {
    return (
      <SoftRedirect
        href={`/new-request/${requestId}/select`}
        fallback={
          <Suspense fallback={<GeneratingSkeleton />}>
            <GeneratingSkeleton />
          </Suspense>
        }
      />
    );
  }

  if (data.status !== 'pending') {
    throw new Error('REQUEST_FAILED');
  }

  return (
    <Suspense fallback={<GeneratingSkeleton />}>
      <GeneratingClient requestId={requestId} />
    </Suspense>
  );
};

export default Page;
