import RequestHeader from '@/components/newRequest/RequestHeader';
import SelectQuestion from '@/components/newRequest/SelectQuestion';
import { GeneratedQuestionItem } from '@/utils/types/types';

import { Suspense } from 'react';
import SelectSkeleton from './loading';

const getRequest = async (requestId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/generate-question/${requestId}/questions`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to fetch request data');
  }

  const json = res.json();

  const questions = (await json).questions as GeneratedQuestionItem[];

  return questions;
};

const Page = async ({ params }: { params: Promise<{ requestId: string }> }) => {
  const { requestId } = await params;

  const questions = await getRequest(requestId);

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await wait(1000);

  return (
    <Suspense fallback={<SelectSkeleton />}>
      <header className="header">
        <RequestHeader text={'Step 4/4'} />
      </header>
      <div className="slideContents">
        <SelectQuestion questions={questions} requestId={requestId} />
      </div>
    </Suspense>
  );
};

export default Page;
