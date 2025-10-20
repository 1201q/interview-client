import GeneratingClient from '@/components/newRequest/GeneratingClient';
import RequestHeader from '@/components/newRequest/RequestHeader';

const TEST_ID = '87ca5626-b201-43f7-82d0-44ea227321dd';

const getRequest = async (requestId: string, isTest: boolean = true) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/generate-question/${isTest ? TEST_ID : requestId}/request`;
  const res = await fetch(url);

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

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await wait(2000);

  return (
    <>
      <header className="header">
        <RequestHeader text={'Step 3/4'} />
      </header>
      <div className="contents">
        <GeneratingClient requestId={requestId} />
      </div>
    </>
  );
};

export default Page;
