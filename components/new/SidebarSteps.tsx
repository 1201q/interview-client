'use client';

import { useAtom } from 'jotai';
import styles from './styles/sidebar.steps.module.css';
import {
  FileTextIcon,
  BriefcaseIcon,
  Loader,
  LucideMousePointerClick,
  Check,
} from 'lucide-react';

import {
  currentRequestStageAtom,
  generatingProgressAtom,
} from '@/store/request-stage';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useHydrateAtoms } from 'jotai/utils';
import { useMemo } from 'react';

const steps = [
  {
    index: 0,
    key: 'resumeText',
    title: '이력서 업로드',
    desc: 'AI가 참고할 자신의 이력서를 업로드해주세요. PDF 파일을 지원해요.',
    href: '/new',
    icon: FileTextIcon,
  },
  {
    index: 1,
    key: 'jobText',
    title: '채용공고 업로드',
    desc: 'AI가 참고할 채용공고를 업로드해주세요. 자신의 이력서와 매칭되는 공고일수록 좋아요.',
    href: '/new',
    icon: BriefcaseIcon,
  },
  {
    index: 2,
    key: 'beforeGenerating',
    title: '맞춤형 질문 생성',
    desc: 'AI가 이력서와 채용공고를 분석해 맞춤형 인터뷰 질문을 생성해요.',
    href: '/new/[id]',
    icon: Loader,
  },
  {
    index: 3,
    key: 'selecting',
    title: '인터뷰 질문 선택',
    desc: '생성된 질문 중 마음에 드는 질문을 선택하세요. 해당 질문들로 인터뷰를 진행해요.',
    href: '/new/[id]/select',
    icon: LucideMousePointerClick,
  },
];

export function SidebarSteps() {
  const [requestStage] = useAtom(currentRequestStageAtom);
  const [generatingProgress] = useAtom(generatingProgressAtom);

  return (
    <nav
      className={` ${requestStage === 'generating' ? styles.loadingSteps : styles.steps}`}
    >
      <AnimatePresence mode="wait">
        {requestStage !== 'generating' && (
          <motion.div
            key="steps"
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className={styles.stepsTitle}>
              자신에게 딱 맞는 질문을 생성해보세요. 4가지 단계면 충분해요.
            </p>
            <ol className={styles.stepList}>
              {steps.map((step, idx) => {
                const stageIndex = steps.findIndex(
                  (s) => s.key === requestStage,
                );
                const current = idx === stageIndex;
                const completed = idx < stageIndex;

                return (
                  <li
                    key={step.key}
                    className={`${styles.step} ${current ? styles.stepCurrent : ''} ${completed ? styles.stepCompleted : ''}`}
                  >
                    <span className={styles.icon}>
                      {completed ? <Check /> : <step.icon />}
                    </span>
                    <div className={styles.stepContent}>
                      <p className={styles.stepTitle}>{step.title}</p>
                      <p className={styles.stepDesc}>{step.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </motion.div>
        )}
        {requestStage === 'generating' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className={styles.loadingTitle}>생성 중...</p>
            <p className={styles.loadingDesc}>
              이력서와 채용공고를 기반으로 질문을 생성하는 중이에요.
            </p>
            <p className={styles.loadingPercent}>{generatingProgress}%</p>
            <div className={styles.loadingRemainingTime}>예상 시간: 30초</div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
