'use client';

import { AnimatePresence, motion, Variants } from 'motion/react';

import { useAtom } from 'jotai';
import { currentRequestStageAtom } from '@/store/request-stage';

import ResumeUploader from '@/components/newRequest/ResumeUploader';
import JobTextUploader from '@/components/newRequest/JobTextUploader';
import RequestHeader from '@/components/newRequest/RequestHeader';
import { Suspense } from 'react';
import RequestSkeleton from './_loading';

const resumeSlideVariants: Variants = {
  enter: { x: '-100%', opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
};

const jobSlideVariants: Variants = {
  enter: { x: '100%', opacity: 0 },
  center: { x: '0%', opacity: 1 },
  exit: { x: '100%', opacity: 0 },
};

const slideTransition = {
  type: 'tween',
  ease: [0.22, 0.61, 0.36, 1],
  duration: 0.5,
};

const Page = () => {
  const [requestStage] = useAtom(currentRequestStageAtom);

  const headerText = () => {
    switch (requestStage) {
      case 'resumeText':
        return 'Step 1/4';
      case 'jobText':
        return 'Step 2/4';
      case 'beforeGenerating':
        return 'Step 3/4';
      case 'generating':
        return 'Step 3/4';
      case 'selecting':
        return 'Step 4/4';
      default:
        return '';
    }
  };

  return (
    <Suspense fallback={<RequestSkeleton />}>
      <header className="header">
        <RequestHeader text={headerText()} />
      </header>
      <div className="contents">
        <AnimatePresence mode="popLayout" initial={false}>
          {requestStage === 'resumeText' && (
            <motion.div
              variants={resumeSlideVariants}
              key="resumeText"
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="animationContainer"
            >
              <ResumeUploader />
            </motion.div>
          )}
          {requestStage === 'jobText' && (
            <motion.div
              variants={jobSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              key="jobText"
              className="animationContainer"
            >
              <JobTextUploader />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Suspense>
  );
};

export default Page;
