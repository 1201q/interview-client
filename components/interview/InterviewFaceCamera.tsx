import WebcamInstance from '../refactorWebcam/WebcamInstance';
import InterviewFaceCameraController from './InterviewFaceCameraController';
import styles from './styles/interview-camera.module.css';

const InterviewFaceCamera = () => {
  return (
    <div className={styles.cameraContainer}>
      <WebcamInstance isRunning={false} drawTargets={{}} />
      <InterviewFaceCameraController />
    </div>
  );
};

export default InterviewFaceCamera;
