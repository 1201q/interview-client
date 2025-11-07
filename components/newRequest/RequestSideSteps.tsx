'use client';

import { useAtom } from 'jotai';
import styles from './styles/r.sidebar.steps.module.css';
import {
  FileTextIcon,
  BriefcaseIcon,
  Loader,
  LucideMousePointerClick,
  Check,
} from 'lucide-react';

import { currentRequestStageAtom } from '@/store/request-stage';
import { AnimatePresence, motion } from 'motion/react';

const steps = [
  {
    index: 0,
    key: ['resumeText'],
    title: '이력서 업로드',
    desc: 'AI가 참고할 자신의 이력서를 업로드해주세요. PDF 파일을 지원해요.',
    href: '/new',
    icon: FileTextIcon,
  },
  {
    index: 1,
    key: ['jobText'],
    title: '채용공고 업로드',
    desc: 'AI가 참고할 채용공고를 업로드해주세요. 자신의 이력서와 매칭되는 공고일수록 좋아요.',
    href: '/new',
    icon: BriefcaseIcon,
  },
  {
    index: 2,
    key: ['beforeGenerating', 'generating'],
    title: '맞춤형 질문 생성',
    desc: 'AI가 이력서와 채용공고를 분석해 맞춤형 인터뷰 질문을 생성해요.',
    href: '/new/[id]',
    icon: Loader,
  },
  {
    index: 3,
    key: ['selecting'],
    title: '인터뷰 질문 선택',
    desc: '생성된 질문 중 마음에 드는 질문을 선택하세요. 해당 질문들로 인터뷰를 진행해요.',
    href: '/new/[id]/select',
    icon: LucideMousePointerClick,
  },
];

export function RequestSideSteps() {
  const [requestStage] = useAtom(currentRequestStageAtom);

  return (
    <nav className={`${styles.steps}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key="steps"
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <p className={styles.listHeader}>새로운 질문 생성</p>
          <ol className={styles.stepList}>
            {steps.map((step, idx) => {
              const stageIndex = steps.findIndex((s) =>
                s.key.includes(requestStage),
              );
              const current = idx === stageIndex;
              const completed = idx < stageIndex;

              return (
                <li
                  key={step.key[0]}
                  className={`${styles.step} ${current ? styles.stepCurrent : ''} ${completed ? styles.stepCompleted : ''}`}
                >
                  <span className={styles.icon}>
                    {completed ? <Check /> : <step.icon />}
                  </span>
                  <div className={styles.stepContent}>
                    <p className={styles.stepTitle}>{step.title}</p>
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
