import Test from '@/components/test';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import AnalyzePage from '../_analyze/page';
import SelectPage from '../_select/page';
import CheckPage from '../_check/page';
import InterviewPage from '../_interview/page';

const Page = async () => {
  const header = await headers();
  const pathname = header.get('x-pathname');

  if (!pathname) {
    return notFound();
  }

  const currentStep = pathname.split('/')[2];

  switch (currentStep) {
    case 'select':
      return <SelectPage step={currentStep} />;
    case 'check':
      return <CheckPage step={currentStep} />;
    case 'interview':
      return <InterviewPage step={currentStep} />;
    case 'analyze':
      return <AnalyzePage step={currentStep} />;
  }
};

export default Page;
