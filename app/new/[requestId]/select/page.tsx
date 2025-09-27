import SidebarStepsHydrated from '@/components/new/SidebarStepsHydrated';
import NewSelectClient from './_content';
import { GeneratedQuestionItem } from '@/utils/types/types';

const TEST_ID = '4e88866e-2a7a-4e66-b49f-12a29e67109e';

const Page = async ({ params }: { params: Promise<{ requestId: string }> }) => {
  const { requestId } = await params;

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/generate-question/${TEST_ID}/questions`,
  );

  if (!data.ok) {
    console.error('Failed to fetch data:', data.statusText);
    return <div>Error</div>;
  }

  const json = await data.json();
  const questions = json.questions as GeneratedQuestionItem[];

  return (
    <>
      <aside className="sidebar">
        <SidebarStepsHydrated initialStage="selecting" />
      </aside>
      <main className="main">
        <div className="spaceBetween">
          <NewSelectClient questions={questions} />
        </div>
      </main>
    </>
  );
};

export default Page;
