import ControllerButton from './Button';
import styles from './styles/controller.module.css';

interface Props {
  start: () => void;
  stop: () => void;
  isRunning: boolean;
}

const Controller = ({ isRunning, start, stop }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <ControllerButton
          onClick={() => {
            if (!isRunning) {
              start();
            } else {
              stop();
            }
          }}
          icon={<></>}
        />
      </div>
    </div>
  );
};

export default Controller;
