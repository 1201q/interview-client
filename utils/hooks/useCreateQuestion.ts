import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { generateQuestion } from '../services/generateQuestion';

const TEST_ID = '4e88866e-2a7a-4e66-b49f-12a29e67109e';

const useCreateQuestion = () => {
  const [stage, setStage] = useState<'input' | 'loading' | 'result' | 'check'>(
    'input',
  );
  const router = useRouter();

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [resumeData, setResumeData] = useState<{ text: string; ok: boolean }>();
  const [jobData, setJobData] = useState<{ text: string; ok: boolean }>();
  const [submitButtonLoading, setSubmitButtonLoading] = useState(false); // input submit 버튼 로딩
  const [requestId, setRequestId] = useState<string | null>(null); // 생성 요청 ID

  useEffect(() => {
    if (jobData?.ok && resumeData?.ok) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [jobData?.ok, resumeData?.ok]);

  const handleResumeInputChange = (text: string) => {
    if (text.length > 100) {
      setResumeData({ text, ok: true });
    } else {
      setResumeData({ text, ok: false });
    }
  };

  const handleJobInputChange = (text: string) => {
    if (text.length >= 100 && text.length <= 1500) {
      setJobData({ text, ok: true });
    } else {
      setJobData({ text, ok: false });
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!jobData?.ok || !resumeData?.ok) {
      alert('이력서와 채용공고를 모두 입력해주세요.');
      return;
    }

    try {
      setSubmitButtonLoading(true);

      const res = await generateQuestion({
        resume_text: resumeData.text,
        job_text: jobData.text,
      });

      if (res.status !== 'completed') {
        throw new Error('면접 질문 생성에 실패했습니다. 다시 시도해주세요.');
      }

      setSubmitButtonLoading(false);
      setRequestId(res.id);
      setStage('loading');
    } catch (error) {
      setSubmitButtonLoading(false);
      setRequestId(null);

      alert('면접 질문 생성에 실패했습니다. 다시 시도해주세요.');
      console.error(error);
    }
  };

  const onLoadingComplete = () => {
    router.push(`/select/${requestId || TEST_ID}`);
  };

  return {
    stage,
    buttonDisabled,
    onSubmit,
    onLoadingComplete,
    handleResumeInputChange,
    handleJobInputChange,
    submitButtonLoading,
    requestId,
  };
};

export default useCreateQuestion;
