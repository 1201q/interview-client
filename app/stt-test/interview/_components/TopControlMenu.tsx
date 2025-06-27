import { useState } from 'react';
import styles from './styles/control.menu.module.css';
import Menu from '@/public/bars.svg';

import Camera from '@/public/webcam-cam-white.svg';

const TopControlMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          className={styles.openButton}
        >
          <Menu />
        </button>
      )}
      {isOpen && (
        <div className={styles.controlContainer}>
          <button
            onClick={() => {
              setIsOpen((prev) => !prev);
            }}
          >
            1
          </button>
          <Camera />
        </div>
      )}
    </div>
  );
};

export default TopControlMenu;
