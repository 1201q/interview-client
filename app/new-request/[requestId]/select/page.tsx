import SelectQuestion from '@/components/newRequest/SelectQuestion';
import { Suspense } from 'react';
import SelectSkeleton from './loading';
import { getRequestQuestions } from '@/utils/services/generate-request';

const Page = async ({ params }: { params: Promise<{ requestId: string }> }) => {
  const { requestId } = await params;

  const result = await getRequestQuestions(requestId);
  const questions = result.questions;

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await wait(700);

  return (
    <Suspense fallback={<SelectSkeleton />}>
      <SelectQuestion questions={questions} requestId={requestId} />
    </Suspense>
  );
};

export default Page;
