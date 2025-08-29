import { AnimatePresence, motion } from 'motion/react';
import styles from './styles/interview-panel.module.css';
import { ChevronUp } from 'lucide-react';
import React from 'react';

type SideComponent = 'transcrie' | 'questionList';

interface InterviewPanelProps {
  id: SideComponent;
  titleText: string;
  isExpanded: boolean;
  onToggle: (id: SideComponent) => void;
  children?: React.ReactNode;
}

const InterviewPanel = (props: InterviewPanelProps) => {
  return (
    <motion.div
      layout
      className={`${styles.sidePanelContainer} ${props.isExpanded ? styles.expanded : ''}`}
      style={{ borderRadius: 12, overflow: 'hidden' }}
    >
      <motion.div
        layout="position"
        className={styles.sidePanelHeader}
        onClick={() => props.onToggle(props.id)}
      >
        <p className={styles.sidePanelTitle}>{props.titleText}</p>

        <motion.div
          animate={{ rotate: props.isExpanded ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronUp color="white" style={{ opacity: 0.4 }} />
        </motion.div>
      </motion.div>

      {props.isExpanded && (
        <motion.div key={props.id} className={`${styles.sidePanelContent}`}>
          {props.children}
        </motion.div>
      )}
    </motion.div>
  );
};

export default React.memo(InterviewPanel);
