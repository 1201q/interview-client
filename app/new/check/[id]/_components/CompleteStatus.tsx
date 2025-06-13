import styles from './styles/status.module.css';
import { CircleCheck } from 'lucide-react';
import { motion } from 'motion/react';

const CompleteStatus = () => {
  return (
    <motion.div
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      className={styles.container}
    >
      <CircleCheck width={30} height={30} />
    </motion.div>
  );
};

export default CompleteStatus;
