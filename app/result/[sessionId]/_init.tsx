'use client';

import ResultClient from '@/components/result/ResultClient';
import ResultSidebar from '@/components/result/ResultSidebar';
import { AnalysisData } from '@/utils/types/analysis';

import { QSessionQuestionItem } from '@/utils/types/interview';
import React from 'react';

interface ResultInitProps {
  questions: QSessionQuestionItem[];
  result: AnalysisData[];
}

const ResultInit = ({ questions, result }: ResultInitProps) => {
  const ordered = [...result].sort((a, b) => a.order - b.order);

  return (
    <>
      <aside className="sidebar">
        <ResultSidebar data={ordered} />
      </aside>
      <main className="main">
        <ResultClient data={ordered} />
      </main>
    </>
  );
};

export default ResultInit;
