import SelectPage from '@/components/beforeInterview/SelectPage';
import SelectPipelineClient from '@/components/beforeInterview/SelectPipelineClient';
import { GeneratedQuestionItem } from '@/utils/types/types';

const TEST_ID = '4e88866e-2a7a-4e66-b49f-12a29e67109e';

const Page = async ({ params }: { params: Promise<{ requestId: string }> }) => {
  const { requestId } = await params;

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/generate-question/${TEST_ID}`,
  );

  if (!data.ok) {
    console.error('Failed to fetch data:', data.statusText);
    return <div>Error</div>;
  }

  const json = await data.json();
  const questions = json.questions as GeneratedQuestionItem[];

  return <SelectPipelineClient questions={questions} />;
};

export default Page;
