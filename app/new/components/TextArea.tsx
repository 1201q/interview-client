'use client';

import { useState } from 'react';
import styles from './styles/textarea.module.css';

interface Props {
  placeholder: string;
  max: number;
}

const TextArea = ({ placeholder, max }: Props) => {
  const [focus, setFocus] = useState(false);
  const [text, setText] = useState('');

  return (
    <div className={`${styles.textAreaContainer} ${focus ? styles.focus : ''}`}>
      <textarea
        className={styles.textArea}
        placeholder={placeholder}
        value={text}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={(e) => setText(e.target.value)}
        maxLength={max}
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
