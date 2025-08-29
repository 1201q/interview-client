import { ChevronUp } from 'lucide-react';
import styles from './styles/analyze-item.module.css';
import { motion } from 'motion/react';
import { CircleUserIcon, BotIcon, Play, Volume2Icon } from 'lucide-react';

interface ItemProps {
  order: number;
  text: string;
  toggleItem: () => void;
  expanded?: boolean;
}

const AnalyzeAnswerItem = ({
  order,
  text,
  toggleItem,
  expanded,
}: ItemProps) => {
  return (
    <motion.div
      layout="position"
      layoutScroll
      className={styles.anwerItemContainer}
    >
      <div className={styles.headerContainer} onClick={toggleItem}>
        <div className={styles.circleContainer}>{order + 1}</div>
        <p className={styles.headerText}>{text}</p>

        <div className={styles.rightHeaderContainer}>
          <div className={styles.scoreContainer}>60점</div>
          <motion.div
            animate={{ rotate: expanded ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronUp />
          </motion.div>
        </div>
      </div>
      {expanded && (
        <motion.div className={styles.bottomContentsContainer}>
          <div className={styles.voiceControllerContainer}>
            <button className={styles.resumePauseButton}>
              <Play size={14} color="white" />
            </button>
            <div className={styles.voiceContents}>
              <Volume2Icon size={15} />
              <p>음성 답변 재생</p>
            </div>
          </div>
          <div className={styles.contentsTitle}>
            <CircleUserIcon size={15} />
            <p>내 답변</p>
            <span>(텍스트를 클릭하면 해당 부분을 재생합니다)</span>
          </div>
          <div className={styles.myAnswerContainer}>
            <p>
              안녕하세요. 저는 3년간 프론트엔드 개발 경험을 가진 개발자입니다.
              주로 React와 TypeScript를 사용하여 사용자 중심의 웹 애플리케이션을
              개발해왔습니다. 이전 회사에서는 팀 리더로서 5명의 개발자와 함께
              프로젝트를 성공적으로 완료한 경험이 있습니다.
            </p>
          </div>
          <div className={styles.contentsTitle}>
            <BotIcon size={15} />
            <p>AI 피드백</p>
          </div>
          <div className={`${styles.myAnswerContainer} ${styles.blue}`}>
            <p>
              안녕하세요. 저는 3년간 프론트엔드 개발 경험을 가진 개발자입니다.
              주로 React와 TypeScript를 사용하여 사용자 중심의 웹 애플리케이션을
              개발해왔습니다. 이전 회사에서는 팀 리더로서 5명의 개발자와 함께
              프로젝트를 성공적으로 완료한 경험이 있습니다.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnalyzeAnswerItem;
