import styles from './styles/sidemenu.module.css';
import Check from '@/public/check.svg';

interface Props {
  text: string;
  isCompleted?: boolean;
  isSelected?: boolean;
  icon: any;
}

const SideMenu = ({ text, isCompleted, isSelected, icon }: Props) => {
  return (
    <div
      className={`${styles.container} ${`${isCompleted ? styles.isCompleted : isSelected ? styles.isSelected : ''}`}`}
    >
      <span className={`${styles.boxContainer} `}>
        {isCompleted && <Check />}
        {!isCompleted && !isSelected && <Check />}
        {!isCompleted && isSelected && icon}
      </span>
      <p>{text}</p>
    </div>
  );
};

export default SideMenu;
