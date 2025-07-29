import { FormEvent, useEffect, useState } from 'react';

const useCreateQuestion = () => {
  const [stage, setStage] = useState<'input' | 'loading' | 'result'>('loading');
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
    setStage('result');
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
