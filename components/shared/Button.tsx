import { ButtonHTMLAttributes } from 'react';
import styles from './styles/button.module.css';

interface ButtonProps {
  attributes?: ButtonHTMLAttributes<HTMLButtonElement>;
  text: string;
  disabled?: boolean;
  color?: 'blue' | 'red';
  isSmallButton?: boolean;
  shadow?: boolean;
  onClick?: () => void;
}

const Button = ({
  attributes,
  text,
  disabled = false,
  color = 'red',
  isSmallButton = false,
  shadow = true,
  onClick,
}: ButtonProps) => {
  return (
    <div
      className={`${styles.buttonContainer} ${shadow ? '' : styles.noshadow} ${color === 'blue' ? styles.blue : ''} ${isSmallButton ? styles.smallButton : ''}`}
    >
      <button {...attributes} disabled={disabled} onClick={onClick}>
        {text}
      </button>
    </div>
  );
};

export default Button;
