import Button from './Button';
import styles from './styles/bottom.controller.module.css';

const BottomController = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <p>질문을 선택하세요</p>
      </div>
      <div className={styles.buttonContainer}>
        <Button text="선택 초기화" disabled={false} />
        <Button text="다음 단계로" disabled={true} color="blue" />
      </div>
    </div>
  );
};

export default BottomController;
