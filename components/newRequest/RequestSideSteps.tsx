'use client';

import styles from './styles/r.sidebar.steps.module.css';
import {
  FileTextIcon,
  BriefcaseIcon,
  Loader,
  LucideMousePointerClick,
  Check,
} from 'lucide-react';

import { AnimatePresence, motion, type Variants } from 'motion/react';
import { getStepFromPathname, StepKey, stepOrder } from '../sidebar/step-util';
import { usePathname } from 'next/navigation';

const menu: Record<StepKey, { title: string; icon: any }> = {
  resume: { title: '이력서 업로드', icon: FileTextIcon },
  job: { title: '채용공고 업로드', icon: BriefcaseIcon },
  generating: { title: '맞춤형 질문 생성', icon: Loader },
  select: { title: '인터뷰 질문 선택', icon: LucideMousePointerClick },
};

const stepVariants: Variants = {
  idle: { opacity: 0.6, x: 0, scale: 0.98 },
  active: {
    opacity: 1,
    x: 2,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
  completed: {
    opacity: 0.9,
    x: 0,
    scale: 0.97,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
};

const iconVariants: Variants = {
  idle: { scale: 1 },
  active: { scale: 1.05 },
  completed: { scale: 1 },
};

export function RequestSideSteps() {
  const pathname = usePathname();
  const current = getStepFromPathname(pathname);

  if (!current) {
    return <div style={{ height: '100%' }}></div>;
  }

  const currentIdx = stepOrder.indexOf(current);
  const progressPercent = (currentIdx / (stepOrder.length - 1 || 1)) * 100;

  return (
    <nav className={`${styles.steps}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key="steps"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.22 }}
        >
          <p className={styles.listHeader}>새로운 면접 시작</p>

          <div className={styles.progressWrapper}>
            {/* 라인 */}
            <div className={styles.progressTrack} />
            {/* 라인 활성화 */}
            <motion.div
              className={styles.progressFill}
              initial={{ height: 0 }}
              animate={{ height: `${progressPercent}%` }}
              transition={{
                type: 'spring',
                stiffness: 220,
                damping: 28,
              }}
            />
            <ol className={styles.stepList}>
              {stepOrder.map((key, idx) => {
                const Icon = menu[key].icon;
                const completed = idx < currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <motion.li
                    key={key}
                    className={`${styles.step} ${isCurrent ? styles.stepCurrent : ''} ${completed ? styles.stepCompleted : ''}`}
                  >
                    {isCurrent && (
                      <motion.div
                        layoutId="stepHighlight"
                        className={styles.stepHighlight}
                        transition={{
                          ease: [0.22, 0.61, 0.36, 1],
                          duration: 0.3,
                        }}
                      />
                    )}
                    <span className={styles.icon}>
                      {completed ? <Check /> : <Icon />}
                    </span>
                    <div className={styles.stepContent}>
                      <p className={styles.stepTitle}>{menu[key].title}</p>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </motion.div>
      </AnimatePresence>
    </nav>
  );
}
