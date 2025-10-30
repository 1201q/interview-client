'use client';

import InterviewBottomController from '@/components/interview-progress/InterviewBottomController';
import InterviewClient from '@/components/interview-progress/InterviewClient';
import InterviewHeader from '@/components/interview-progress/InterviewHeader';
import InterviewPermissionOverlay from '@/components/interview-progress/InterviewPermissionOverlay';

import { useInterview } from '@/components/interview-progress/InterviewProvider';
import InterviewSidebar from '@/components/interview-progress/InterviewSidebar';

import GlobalVideoBg from '@/components/refactorWebcam/GlobalVideoBg';

import styles from './page.module.css';

const Page = () => {
  const { ...props } = useInterview();

  return (
    <div className={styles.container}>
      <GlobalVideoBg />
      <InterviewPermissionOverlay />
      <div className={styles.wrapper}>
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
    </div>
  );
};

export default Page;
