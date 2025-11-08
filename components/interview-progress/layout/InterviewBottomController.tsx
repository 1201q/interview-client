'use client';

import { useState } from 'react';

import { useInterview } from '../core/InterviewProvider';
import InterviewSubmitButton from './InterviewSubmitButton';
import styles from './styles/i.bottom.module.css';

import { AnimatePresence, motion } from 'motion/react';
import { LucideText, SpeechIcon, Settings } from 'lucide-react';
import InterviewSettingModal from './InterviewSettingModal';

const InterviewBottomController = (props: ReturnType<typeof useInterview>) => {
  const {
    toggleQuestionList,
    toggleSttComponent,
    cameraObjectFitOpt,
    toggleCameraObjectFit,
  } = props;

  const [openSettingModal, setOpenSettingModal] = useState(false);

  return (
    <div className={styles.main}>
      <motion.div layout className={styles.group}>
        <ExpandingButton
          label={'질문 목록'}
          onClick={toggleQuestionList}
          icon={<LucideText size={15} />}
        />
        <ExpandingButton
          label={'STT 결과 보기'}
          onClick={toggleSttComponent}
          icon={<SpeechIcon size={15} />}
        />
      </motion.div>

      <div className={styles.group}>
        <div className={styles.overlayBottomButton}>
          <InterviewSubmitButton
            phase={props.clientPhase}
            startAnswer={props.doStartAnswer}
            startCountdown={props.doStartCountdown}
            submitAnswer={props.doSubmitAnswer}
            startInterview={props.doStartSession}
            complete={props.doComplete}
          />
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.setting}>
          <Button
            onClick={() => setOpenSettingModal((prev) => !prev)}
            icon={<Settings size={17} />}
          />
          <AnimatePresence>
            {openSettingModal && (
              <InterviewSettingModal
                {...props}
                onClose={() => setOpenSettingModal(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ExpandingButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      type="button"
      className={styles.menuToggleButton}
      onClick={onClick}
      layout
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <span className={styles.iconWrap}>{icon}</span>

      <motion.span
        animate={{
          width: hovered ? 'auto' : 0,
          opacity: hovered ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 38, mass: 0.6 }}
        className={styles.labelBox}
      >
        <span className={styles.label}>{label}</span>
      </motion.span>
    </motion.button>
  );
};

const Button = ({
  icon,
  onClick,
}: {
  icon: React.ReactNode;

  onClick: () => void;
}) => {
  return (
    <motion.button
      type="button"
      className={styles.menuToggleButton}
      onClick={onClick}
      layout
    >
      <span className={styles.iconWrap}>{icon}</span>
    </motion.button>
  );
};

export default InterviewBottomController;
