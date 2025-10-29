'use client';

import InterviewBottomController from '@/components/interview-progress/InterviewBottomController';
import InterviewClient from '@/components/interview-progress/InterviewClient';
import InterviewHeader from '@/components/interview-progress/InterviewHeader';
import InterviewPermissionOverlay from '@/components/interview-progress/InterviewPermissionOverlay';
import InterviewProgress from '@/components/interview-progress/InterviewProgress';
import { useInterview } from '@/components/interview-progress/InterviewProvider';
import InterviewSidebar from '@/components/interview-progress/InterviewSidebar';

const Page = () => {
  const { ...props } = useInterview();

  return (
    <div className="container">
      <div className="wrapper">
        <InterviewPermissionOverlay />
        <InterviewProgress {...props} />
        <div className="main">
          <header className="header">
            <InterviewHeader />
          </header>
          <div className="center">
            <div className="centerGrid">
              <div
                className={`sidebarSpacer ${!props.visibleQuestionList ? 'hidden' : ''}`}
              >
                <aside className="sidebarPanel">
                  <InterviewSidebar />
                </aside>
              </div>
              <main className="camera">
                <InterviewClient {...props} />
              </main>
            </div>
          </div>

          <div className="bottom">
            <InterviewBottomController {...props} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
