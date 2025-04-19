import styles from './styles/button.module.css';

interface Props {
  onClick?: () => void;
  color?: 'blue' | 'red' | 'black';
  disabled: boolean;
  text: string;
  icon?: any;
}

const Button = ({ onClick, color, disabled, text, icon }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={` ${styles.button} ${color ? styles[color] : ''} `}
    >
      {icon && icon}
      <p>{text}</p>
    </button>
  );
};

export default Button;
