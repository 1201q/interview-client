'use client';

import { useEffect, useState } from 'react';
import styles from './styles/textarea.module.css';
import React from 'react';

interface TextAreaProps {
  minLength?: number;
  maxLength?: number;
  textAreaName: string;
  placeholder: string;
  handleInputChange: (text: string) => void;
}

const TextArea = ({
  minLength = 100,
  maxLength = 1500,
  textAreaName,
  placeholder,
  handleInputChange,
}: TextAreaProps) => {
  const [focus, setFocus] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    return () => {
      // if (unmount) {
      //   unmount();
      // }
    };
  }, []);

  return (
    <div className={`${styles.textAreaContainer} ${focus ? styles.focus : ''}`}>
      <textarea
        className={styles.textArea}
        name={textAreaName}
        minLength={minLength}
        maxLength={maxLength}
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={(e) => {
          setText(e.target.value);

          if (e.target.value.length >= minLength) {
            handleInputChange(e.target.value);
          } else {
            handleInputChange('');
          }
        }}
      />
      <div className={styles.textAreaBottomContainer}>
        <p>
          {text.length}/{maxLength}
        </p>
      </div>
    </div>
  );
};

export default React.memo(TextArea);
