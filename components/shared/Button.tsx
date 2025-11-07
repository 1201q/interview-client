'use client';

import styles from './styles/button.module.css';
import { AnimatePresence, HTMLMotionProps, motion } from 'motion/react';
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
  loading = false,
  onClick,
}: ButtonProps) => {
  const btnStyle = (c: any) =>
    c === 'blue'
      ? styles.blue
      : c === 'gray'
        ? styles.gray
        : c === 'red'
          ? styles.red
          : '';

  return (
    <motion.div className={`${styles.buttonContainer} ${btnStyle(color)}`}>
      <motion.button
        {...attributes}
        type="button"
        disabled={disabled || loading}
        onClick={onClick}
        className={styles.button}
        transition={{ layout: { type: 'tween', duration: 0.12 } }}
        aria-busy={loading}
        aria-disabled={disabled || loading}
      >
        <div className={styles.inner} data-loading={loading ? '1' : '0'}>
          <AnimatePresence initial={false} mode="wait">
            {loading ? (
              <motion.span
                key="loader"
                className={styles.loaderSlot}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 18, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.14, ease: 'easeOut' }}
              >
                <motion.span
                  aria-hidden
                  className={styles.loaderIconWrap}
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.9,
                    ease: 'linear',
                  }}
                >
                  <LoaderCircle size={18} strokeWidth={2.5} />
                </motion.span>
              </motion.span>
            ) : (
              <motion.span
                key="no-loader"
                className={styles.loaderSlot}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 0, opacity: 0 }}
                exit={{ width: 0, opacity: 0 }}
              />
            )}
          </AnimatePresence>

          <motion.div
            className={styles.textViewport}
            animate={{ paddingLeft: loading ? 8 : 0 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={text}
                className={styles.buttonText}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
              >
                {text}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.button>
    </motion.div>
  );
};

export default SharedButton;
