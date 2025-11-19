import SoftRedirect from '@/components/shared/SoftRedirect';
import { getRequestStatus } from '@/utils/services/generate-request';
import { notFound } from 'next/navigation';
import SelectSkeleton from './select/loading';
import GeneratingSkeleton from './generating/loading';

const Page = async ({ params }: { params: Promise<{ requestId: string }> }) => {
  const { requestId } = await params;

  try {
    const data = await getRequestStatus(requestId);

    if (data.status === 'completed') {
      return (
        <SoftRedirect
          href={`/new-request/${requestId}/select`}
          fallback={<SelectSkeleton />}
        />
      );
    }
    if (data.status === 'pending') {
      return (
        <SoftRedirect
          href={`/new-request/${requestId}/generating`}
          fallback={<GeneratingSkeleton />}
        />
      );
    }

    throw new Error('REQUEST_FAILED');
  } catch (err: any) {
    if (err?.status === 404) notFound();
    throw new Error('REQUEST_FAILED');
  }
};

export default Page;
