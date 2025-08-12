import Button from '../shared/Button';
import styles from './styles/interview-camera.controller.module.css';

const InterviewFaceCameraController = () => {
  return (
    <div className={styles.cameraControllerContainer}>
      <div className={styles.controllerHeaderContainer}>
        <div className={styles.badge}>질문 2</div>
      </div>
      <div className={styles.questionTextContainer}>
        <p>
          도토리 서비스의 슬로우 쿼리(페이징 조회) 문제를 개선하셨다고 했는데,
          해당 이슈를 발견하게 된 계기와 개선 과정에서 가장 신경 썼던 부분,
          그리고 만약 성능 개선이 기대에 미치지 않았다면 어떤 추가적인 시도를
          했을지 말씀해 주세요.
        </p>
      </div>
      <Button
        text="답변 제출"
        isSmallButton={true}
        color="blue"
        shadow={false}
      />
    </div>
  );
};

export default InterviewFaceCameraController;
