'use client';

import styles from './styles/r.sidebar.steps.module.css';
import {
  FileTextIcon,
  BriefcaseIcon,
  Loader,
  LucideMousePointerClick,
  Check,
} from 'lucide-react';

import { AnimatePresence, motion } from 'motion/react';
import { getStepFromPathname, StepKey, stepOrder } from '../sidebar/step-util';
import { usePathname } from 'next/navigation';

const menu: Record<StepKey, { title: string; icon: any }> = {
  resume: { title: '이력서 업로드', icon: FileTextIcon },
  job: { title: '채용공고 업로드', icon: BriefcaseIcon },
  generating: { title: '맞춤형 질문 생성', icon: Loader },
  select: { title: '인터뷰 질문 선택', icon: LucideMousePointerClick },
};

export function RequestSideSteps() {
  const pathname = usePathname();
  const current = getStepFromPathname(pathname);

  if (!current) {
    return <div style={{ height: '100%' }}></div>;
  }

  const currentIdx = stepOrder.indexOf(current);

  return (
    <nav className={`${styles.steps}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key="steps"
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <p className={styles.listHeader}>새로운 면접 시작</p>

          <ol className={styles.stepList}>
            {stepOrder.map((key, idx) => {
              const Icon = menu[key].icon;
              const completed = idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <li
                  key={key}
                  className={`${styles.step} ${isCurrent ? styles.stepCurrent : ''} ${completed ? styles.stepCompleted : ''}`}
                >
                  <span className={styles.icon}>
                    {completed ? <Check /> : <Icon />}
                  </span>
                  <div className={styles.stepContent}>
                    <p className={styles.stepTitle}>{menu[key].title}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </motion.div>
      </AnimatePresence>
    </nav>
  );
}
