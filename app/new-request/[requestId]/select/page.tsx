import RequestHeader from '@/components/newRequest/RequestHeader';
import SelectQuestion from '@/components/newRequest/SelectQuestion';
import { GeneratedQuestionItem } from '@/utils/types/types';

import { Suspense } from 'react';

const TEST_ID = 'd2151465-878d-4996-9aba-c2dd0e830598';

const getRequest = async (requestId: string, isTest: boolean = true) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/generate-question/${isTest ? TEST_ID : requestId}/questions`;
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

  return (
    <>
      <header className="header">
        <RequestHeader text={'Step 4/4'} />
      </header>
      <div className="contents">
        <Suspense fallback={<div>1</div>}>
          <SelectQuestion questions={questions} />
        </Suspense>
      </div>
    </>
  );
};

export default Page;
