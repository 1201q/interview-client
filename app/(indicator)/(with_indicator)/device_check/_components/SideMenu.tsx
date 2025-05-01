import styles from './styles/sidemenu.module.css';
import Check from '@/public/check.svg';

interface Props {
  text?: string;

  isCompleted?: boolean;
  isSelected?: boolean;
  number: number;
}

const SideMenu = ({ text, isCompleted, number, isSelected }: Props) => {
  return (
    <div
      className={`${styles.container} ${`${isCompleted ? styles.isCompleted : isSelected ? styles.isSelected : ''}`}`}
    >
      <span className={`${styles.boxContainer} `}>
        {isCompleted ? <Check /> : <p>{number}</p>}
      </span>
      <p>{text ? text : '카메라 체크'}</p>
    </div>
  );
};

export default SideMenu;
