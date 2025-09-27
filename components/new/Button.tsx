'use client';

import styles from './styles/button.module.css';
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';

type MotionBtnAttrs = Omit<HTMLMotionProps<'button'>, 'onClick' | 'disabled'>;

interface ButtonProps {
  attributes?: MotionBtnAttrs;
  text: string;
  disabled?: boolean;
  color?: 'blue' | 'gray' | 'red';
  onClick?: () => void;
  loading?: boolean;
}

const SharedButton = ({
  attributes,
  text,
  disabled = false,
  color = 'blue',
  loading,
  onClick,
}: ButtonProps) => {
  const btnStyle = (color: any) => {
    if (color === 'blue') {
      return styles.blue;
    } else if (color === 'gray') {
      return styles.gray;
    } else if (color === 'red') {
      return styles.red;
    } else {
      return '';
    }
  };

  return (
    <motion.div className={`${styles.buttonContainer} ${btnStyle(color)}`}>
      <motion.button
        layout
        {...attributes}
        disabled={disabled || loading}
        onClick={onClick}
      >
        <AnimatePresence mode="wait" initial={false}>
          {loading && (
            <motion.div
              key="loader"
              style={{ display: 'flex' }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 28, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                style={{ display: 'flex' }}
              >
                <LoaderCircle color="white" size={20} strokeWidth={2} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div className={styles.buttonText}>{text}</motion.div>
      </motion.button>
    </motion.div>
  );
};

export default SharedButton;
