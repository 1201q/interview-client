import { Suspense } from 'react';
import RequestSkeleton from '../loading';
import { getAnalysesList } from '@/utils/services/analyses';
import HistoryHeader from '@/components/history/HistoryHeader';
import InterviewHistoryList from '@/components/history/InterviewHistoryList';

const Page = async () => {
  const data = await getAnalysesList();

  return (
    <Suspense fallback={<RequestSkeleton />}>
      <header className="header">
        <HistoryHeader text="진행한 면접" />
      </header>
      <div className="slideContents">
        <InterviewHistoryList data={data.results} />
      </div>
    </Suspense>
  );
};

export default Page;
