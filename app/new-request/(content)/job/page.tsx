'use client';

import JobTextUploader from '@/components/newRequest/JobTextUploader';
import { resumeTextAtom } from '@/store/request-stage';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Page = () => {
  const router = useRouter();
  const resumeText = useAtomValue(resumeTextAtom);

  useEffect(() => {
    if (!resumeText || resumeText.trim() === '') {
      alert('입력받은 이력서가 없습니다. 이력서를 먼저 업로드해주세요.');
      router.replace('/new-request/resume');
    }
  }, [router, resumeText]);

  return <JobTextUploader />;
};

export default Page;
