'use client';

import { useEffect, useState } from 'react';
import styles from './styles/textarea.module.css';

interface Props {
  placeholder: string;
  max: number;
  min?: number;
  name: string;
  handleCheck: (check: boolean) => void;
  unmount?: () => void;
}

const TextArea = ({
  placeholder,
  min = 100,
  max,
  name,
  handleCheck,
  unmount,
}: Props) => {
  const [focus, setFocus] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    return () => {
      if (unmount) {
        unmount();
      }
    };
  }, []);

  return (
    <div className={`${styles.textAreaContainer} ${focus ? styles.focus : ''}`}>
      <textarea
        className={styles.textArea}
        placeholder={placeholder}
        value={text}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={(e) => {
          setText(e.target.value);

          if (e.target.value.length >= min) {
            handleCheck(true);
          } else {
            handleCheck(false);
          }
        }}
        maxLength={max}
        minLength={min}
        name={name}
      ></textarea>
      <div className={styles.textAreaBottomContainer}>
        <p>
          {text.length}/{max}
        </p>
      </div>
    </div>
  );
};

export default TextArea;
