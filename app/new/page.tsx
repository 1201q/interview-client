'use client';

import NewHeader from '@/components/header/NewHeader';
import styles from './page.module.css';
import Header from './components/Header';
import Container from './components/Container';
import ResumeLoading from './components/ResumeLoading';
import { useTransition } from 'react';
import { generateQuestionsFromResume } from '@/utils/actions/resume';

const Page = () => {
  const [isPending, startTransition] = useTransition();

  const handleSubmitWithFile = async (
    formData: FormData,
    resumeText: string,
  ) => {
    const recruitmentText = formData.get('recruitment')?.toString() || '';

    try {
      startTransition(() => {
        generateQuestionsFromResume(resumeText, recruitmentText);
      });
    } catch (error) {
      console.log(error);
      alert('에러!');
    }
  };

  const handleSubmitWithText = async (formData: FormData) => {
    const resumeText = formData.get('resume')?.toString() || '';
    const recruitmentText = formData.get('recruitment')?.toString() || '';

    try {
      startTransition(() => {
        generateQuestionsFromResume(resumeText, recruitmentText);
      });
    } catch (error) {
      console.log(error);
      alert('에러!');
    }
  };

  return (
    <div className={styles.container}>
      <NewHeader />
      <div
        className={`${isPending ? styles.loadingBgContainer : styles.bgContainer}`}
      ></div>
      <div className={styles.contents}>
        {!isPending && (
          <>
            <Header />
            <Container
              handleSubmitWithFile={handleSubmitWithFile}
              handleSubmitWithText={handleSubmitWithText}
            />
          </>
        )}

        {isPending && <ResumeLoading />}
      </div>
    </div>
  );
};

export default Page;
