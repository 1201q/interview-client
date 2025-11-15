import GeneratingClient from '@/components/newRequest/GeneratingClient';
import RequestHeader from '@/components/newRequest/RequestHeader';
import { Suspense } from 'react';
import GeneratingSkeleton from './loading';
import { cookies } from 'next/headers';

const getRequest = async (requestId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/generate-question/${requestId}/request`;

  const cookieStore = await cookies();
  const cookie = cookieStore.toString();

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      cookie,
      accept: 'application/json',
    },
    cache: 'no-store',
  });

  console.log(res);

  if (!res.ok) {
    throw new Error('Failed to fetch request data');
  }

  return res.json() as Promise<{
    request_id: string;
    status: 'pending' | 'working' | 'completed' | 'failed';
  }>;
};

const Page = async ({ params }: { params: Promise<{ requestId: string }> }) => {
  const { requestId } = await params;

  const requestData = await getRequest(requestId);

  console.log(requestData);

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
