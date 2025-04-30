import styles from './styles/controller.button.module.css';

interface Props {
  icon: any;
  onClick?: () => void;
}

const ControllerButton = ({ icon, onClick }: Props) => {
  return (
    <button className={styles.container} onClick={onClick}>
      {icon && icon}
    </button>
  );
};

export default ControllerButton;
