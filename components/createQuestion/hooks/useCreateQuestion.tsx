import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

const TEST_ID = '4e88866e-2a7a-4e66-b49f-12a29e67109e';

const useCreateQuestion = () => {
  const [stage, setStage] = useState<'input' | 'loading' | 'result' | 'check'>(
    'check',
  );
  const router = useRouter();

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [resumeData, setResumeData] = useState<{ text: string; ok: boolean }>();
  const [jobData, setJobData] = useState<{ text: string; ok: boolean }>();

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
    console.log(jobData?.text, resumeData?.text);

    setStage('loading');
  };

  const onLoadingComplete = () => {
    // setStage('result');
    router.push(`/select/${TEST_ID}`);
  };

  return {
    stage,
    buttonDisabled,
    onSubmit,
    onLoadingComplete,
    handleResumeInputChange,
    handleJobInputChange,
  };
};

export default useCreateQuestion;
