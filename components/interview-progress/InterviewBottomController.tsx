'use client';

import { useInterview } from './InterviewProvider';
import InterviewSubmitButton from './InterviewSubmitButton';
import styles from './styles/i.client.module.css';

const InterviewBottomController = (props: ReturnType<typeof useInterview>) => {
  const { currentQuestion, serverStatus, rawStableData, clientPhase } = props;
  return (
    <div className={styles.overlayBottomButton}>
      <InterviewSubmitButton
        phase={props.clientPhase}
        startAnswer={props.doStartAnswer}
        startCountdown={props.doStartCountdown}
        submitAnswer={props.doSubmitAnswer}
        startInterview={props.doStartSession}
      />
    </div>
  );
};

export default InterviewBottomController;
