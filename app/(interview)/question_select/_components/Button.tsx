'use client';

import { useFormStatus } from 'react-dom';
import styles from './styles/button.module.css';

interface Props {
  onClick?: () => void;
  color?: 'blue' | 'red' | 'black';
  disabled: boolean;
  text: string;
  icon?: any;
  type?: 'submit' | 'button';
}

const Button = ({
  onClick,
  color,
  disabled,
  text,
  icon,
  type = 'button',
}: Props) => {
  const formStatus = useFormStatus();

  if (type === 'submit' && formStatus.pending) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={true}
        className={` ${styles.button} ${color ? styles[color] : ''} `}
      >
        <p>전송중...</p>
      </button>
    );
  }

  return (
    <button
      type={type}
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
