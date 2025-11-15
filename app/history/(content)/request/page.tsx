import { Suspense } from 'react';
import RequestSkeleton from '../loading';

import HistoryHeader from '@/components/history/HistoryHeader';

import { getRequestsList } from '@/utils/services/generate-request';
import RequestHistoryList from '@/components/history/RequestHistoryList';

const Page = async () => {
  const data = await getRequestsList();

  return (
    <Suspense fallback={<RequestSkeleton />}>
      <header className="header">
        <HistoryHeader text="질문 생성 요청" />
      </header>
      <div className="slideContents">
        <RequestHistoryList data={data.results} />
      </div>
    </Suspense>
  );
};

export default Page;
