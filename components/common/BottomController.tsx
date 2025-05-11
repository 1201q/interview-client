import styles from './styles/bottom.controller.module.css';

interface Props {
  leftContent?: React.ReactNode;
  rightContent: React.ReactNode;
}

const BottomController = ({ leftContent, rightContent }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.flex}>
        <div className={styles.leftContainer}>{leftContent && leftContent}</div>
        <div className={styles.buttonContainer}>{rightContent}</div>
      </div>
    </div>
  );
};

export default BottomController;
