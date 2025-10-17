'use client';

import WebcamInstance from '../refactorWebcam/WebcamInstance';
import { useInterview } from './InterviewProvider';
import InterviewSubmitButton from './InterviewSubmitButton';
import styles from './styles/i.client.module.css';

const InterviewClient = (props: ReturnType<typeof useInterview>) => {
  const { currentQuestion, serverStatus } = props;

  return (
    <div className={styles.main}>
      <div className={styles.top}>
        <div className={styles.camera}>
          <WebcamInstance isRunning={true} drawTargets={{}} />
          <div className={styles.qOverlay}>
            {serverStatus === 'in_progress' && currentQuestion && (
              <>
                <span className={styles.qStatus}>
                  질문 {currentQuestion && currentQuestion.order + 1}
                </span>
                <h2 className={styles.qText}>
                  {currentQuestion && currentQuestion.text}
                </h2>
              </>
            )}
            {serverStatus === 'not_started' && (
              <>
                <span className={styles.qStatus}>면접 시작 전</span>
                <h2 className={styles.qText}>
                  면접이 시작되면 이 곳에 질문이 표시됩니다. 면접 시작하기를
                  누르면 면접이 시작됩니다.
                </h2>
              </>
            )}
            {serverStatus === 'completed' && (
              <>
                <span className={styles.qStatus}>면접 종료</span>
                <h2 className={styles.qText}>
                  면접이 종료되었습니다. 수고하셨습니다.
                </h2>
              </>
            )}
          </div>
          <div className={styles.submitButton}>
            <InterviewSubmitButton
              phase={props.clientPhase}
              startAnswer={props.doStartAnswer}
              startCountdown={props.doStartCountdown}
              submitAnswer={props.doSubmitAnswer}
              startInterview={props.doStartSession}
            />
          </div>
        </div>
      </div>

      <div className={styles.sttPanel}>
        <span>
          협업에서 ‘극도의 투명함’을 실천하기 위해 평소에 유지하는 한 가지
          루틴을 소개해 주세요. 협업에서 ‘극도의 투명함’을 실천하기 위해 평소에
          유지하는 한 가지 루틴을 소개해 주세요. 협업에서 ‘극도의 투명함’을
          실천하기 위해 평소에 유지하는 한 가지 루틴을 소개해 주세요.협업에서
          ‘극도의 투명함’을 실천하기 위해 평소에 유지하는 한 가지 루틴을 소개해
          주세요. 협업에서 ‘극도의 투명함’을 실천하기 위해 평소에 유지하는 한
          가지 루틴을 소개해 주세요. 협업에서 ‘극도의 투명함’을 실천하기 위해
          평소에 유지하는 한 가지 루틴을 소개해 주세요.협업에서 ‘극도의
          투명함’을 실천하기 위해 평소에 유지하는 한 가지 루틴을 소개해 주세요.
          협업에서 ‘극도의 투명함’을 실천하기 위해 평소에 유지하는 한 가지
          루틴을 소개해 주세요. 협업에서 ‘극도의 투명함’을 실천하기 위해 평소에
          유지하는 한 가지 루틴을 소개해 주세요.
        </span>
      </div>
    </div>
  );
};

const Camera = () => {
  return (
    <div className={styles.camera}>
      <WebcamInstance isRunning={true} drawTargets={{}} />
      <div className={styles.qOverlay}>
        <span className={styles.qStatus}>질문 1</span>
        <h2 className={styles.qText}>
          협업에서 ‘극도의 투명함’을 실천하기 위해 평소에 유지하는 한 가지
          루틴을 소개해 주세요.
        </h2>
      </div>
    </div>
  );
};

export default InterviewClient;
