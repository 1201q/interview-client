import SelectQuestion from '@/components/newRequest/SelectQuestion';
import { Suspense } from 'react';
import SelectSkeleton from './loading';
import {
  getRequestQuestions,
  getRequestStatus,
} from '@/utils/services/generate-request';
import { notFound } from 'next/navigation';
import SoftRedirect from '@/components/shared/SoftRedirect';

const Page = async ({ params }: { params: Promise<{ requestId: string }> }) => {
  const { requestId } = await params;

  try {
    const status = await getRequestStatus(requestId);

    if (status.status === 'pending') {
      return (
        <SoftRedirect
          href={`/new-request/${requestId}/generating`}
          fallback={<SelectSkeleton />}
        />
      );
    }

    if (status.status !== 'completed') {
      throw new Error('REQUEST_FAILED');
    }
  } catch (error: any) {
    if (error?.status === 404) notFound();
    throw new Error('REQUEST_FAILED');
  }

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await wait(500);

  try {
    const data = await getRequestQuestions(requestId);
    const questions = data.questions;

    return (
      <Suspense fallback={<SelectSkeleton />}>
        <SelectQuestion questions={questions} requestId={requestId} />
      </Suspense>
    );
  } catch (error: any) {
    if (error?.status === 404) notFound();
    throw new Error('REQUEST_FAILED');
  }
};

export default Page;
