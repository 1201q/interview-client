'use client';

import { useEffect, useRef } from 'react';
import styles from '../_styles/dropdown.module.css';

interface Props {
  onClick: (option: string) => void;
  outsideClick: () => void;
  menu: string[];
}

const DropDownOptions = ({ menu, onClick, outsideClick }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        outsideClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [outsideClick]);

  return (
    <div className={styles.container} ref={ref}>
      {menu.map((item) => (
        <div onClick={() => onClick(item)} className={styles.menu} key={item}>
          <p>{item}</p>
        </div>
      ))}
    </div>
  );
};

export default DropDownOptions;
