'use client';

import InterviewBottomController from '@/components/interview-progress/InterviewBottomController';
import InterviewClient from '@/components/interview-progress/InterviewClient';
import InterviewHeader from '@/components/interview-progress/InterviewHeader';

import { useInterview } from '@/components/interview-progress/InterviewProvider';
import InterviewSidebar from '@/components/interview-progress/InterviewSidebar';

import GlobalVideoBg from '@/components/refactorWebcam/GlobalVideoBg';

import styles from './page.module.css';
import { useAtomValue } from 'jotai';
import { isInterviewReadyAtom } from '@/store/interview';
import InterviewGateOverlay from '@/components/interview-progress/InterviewGateOverlay';
import { AnimatePresence, motion } from 'motion/react';
import InterviewGateController from '@/components/interview-progress/InterviewGateController';

const Page = () => {
  const props = useInterview();
  const isInterviewReady = useAtomValue(isInterviewReadyAtom);

  return (
    <div className={styles.container}>
      {/* 항상 작동 */}
      <InterviewGateController />

      <AnimatePresence mode="wait">
        {!isInterviewReady && <InterviewGateOverlay />}
      </AnimatePresence>

      {/* 인터뷰 화면 */}
      {true && (
        <motion.div
          key="interview"
          style={{ width: '100%', height: '100%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <Interview {...props} />
        </motion.div>
      )}
    </div>
  );
};

const Interview = (props: ReturnType<typeof useInterview>) => {
  return (
    <div className={styles.wrapper}>
      <GlobalVideoBg />
      <div className={styles.main}>
        <header className={styles.header}>
          <InterviewHeader />
        </header>
        <div className={styles.center}>
          <div className={styles.centerGrid}>
            <div
              className={`${styles.sidebarSpacer} ${!props.visibleQuestionList ? styles.hidden : ''}`}
            >
              <aside className={styles.sidebarPanel}>
                <InterviewSidebar />
              </aside>
            </div>
            <main className={styles.camera}>
              <InterviewClient {...props} />
            </main>
          </div>
        </div>

        <div className={styles.bottom}>
          <InterviewBottomController {...props} />
        </div>
      </div>
    </div>
  );
};

export default Page;
