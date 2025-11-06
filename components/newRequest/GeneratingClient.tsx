'use client';

import {
  currentRequestStageAtom,
  generatingProgressAtom,
} from '@/store/request-stage';
import { useAtom } from 'jotai';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';

import styles from './styles/generating.module.css';
import { v4 as uuid } from 'uuid';
import { GeneratedQuestionItem } from '@/utils/types/types';
import { LoaderCircle, Clock } from 'lucide-react';
import { useStableSSE } from '@/utils/hooks/useStableSSE';
import { useRouter } from 'next/navigation';
import { GenerateEvent } from '@/utils/types/generate-sse';

const MAX_VISIBLE_QUESTIONS = 3;
const ITEM_HEIGHT = 100;
const GAP = 15;
const PADDING = 10;
const HEIGHT =
  ITEM_HEIGHT * MAX_VISIBLE_QUESTIONS +
  GAP * (MAX_VISIBLE_QUESTIONS - 1) +
  PADDING * 2;

interface GeneratingProps {
  questions: GeneratedQuestionItem[];
  progress: number;
}

interface Props {
  requestId: string;
}

const GeneratingClient = ({ requestId }: Props) => {
  const [requestStage, setRequestStage] = useAtom(currentRequestStageAtom);
  const [generatedQuestions, setGeneratedQuestions] = useState<
    GeneratedQuestionItem[]
  >([]);

  const router = useRouter();

  const [progress, setProgress] = useAtom(generatingProgressAtom);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/generate-question/${requestId}/stream?mock=false`;

  useStableSSE<GenerateEvent>(url, {
    onOpen: () => {
      setRequestStage('generating');
    },
    onMessage: (ev) => {
      console.log(ev);
    },
    onNamed: {
      question: (data) => {
        console.log(data);
        setGeneratedQuestions((prev) => [...prev, { ...data, id: uuid() }]);
      },

      progress: (data) => {
        if (data?.limitCount) {
          setProgress(Math.floor((data.createdTotal / data.limitCount) * 100));
        }
      },

      completed: () => {
        setProgress(100);
        setRequestStage('selecting');
        router.replace(`/new-request/${requestId}/select`);
      },
    },

    onError: (error) => {
      console.warn('SSE error:', error);
    },
  });

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {requestStage === 'beforeGenerating' && (
        <motion.div
          key="before-generating"
          initial="enter"
          animate="center"
          exit="exit"
          style={{ inset: 0 }}
        >
          <BeforeGenerating />
        </motion.div>
      )}
      {requestStage === 'generating' && (
        <motion.div
          key="generating"
          initial="enter"
          animate="center"
          exit="exit"
          style={{ inset: 0, height: '100%' }}
        >
          <Generating questions={generatedQuestions} progress={progress} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const BeforeGenerating = () => {
  return (
    <div className={styles.main}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
        className={styles.loading}
      >
        {/* <LoaderCircle color="var( --neutral-4)" size={80} strokeWidth={2} /> */}
      </motion.div>
    </div>
  );
};

const Generating = ({ questions, progress }: GeneratingProps) => {
  const visible = useMemo(
    () => questions.slice(-MAX_VISIBLE_QUESTIONS),
    [questions],
  );
  const baseIndex = questions.length - visible.length;

  const slotY = (slotIndex: number) => slotIndex * (ITEM_HEIGHT + GAP);

  /**
   * n=1 → [center]
   * n=2 → [center - half, center + half]
   * n=3 → [top, middle, bottom]
   */
  const getSlotPositions = (n: number) => {
    const top = 0;
    const mid = slotY(1);
    const bottom = slotY(2);

    if (n <= 1) return [mid]; // 가운데 하나!

    if (n === 2)
      // 가운데 기준 위아래 하나씩 벌어지게
      return [mid - (ITEM_HEIGHT + GAP) / 2, mid + (ITEM_HEIGHT + GAP) / 2];

    return [top, mid, bottom]; // 그냥 위, 중간, 아래
  };

  const positions = getSlotPositions(visible.length);

  const enterFrom = (isNewest: boolean, count: number, yTarget: number) => {
    if (!isNewest) return undefined; // 기존 아이템은 재배치만
    if (count === 1) return { y: yTarget + 48, opacity: 1 }; // 1개일 땐 조금 아래에서
    if (count === 2) return { y: yTarget + 102, opacity: 1 };
    return { y: HEIGHT + 24, opacity: 1 }; // 3개 이상부터는 컨테이너 밖에서
  };

  return (
    <div className={styles.itemList}>
      <div
        className={styles.stackViewport}
        style={{
          maxHeight: HEIGHT,
        }}
      >
        <AnimatePresence initial={false}>
          {visible.map((q, index) => {
            const yTarget = positions[index];
            const isNewest = index === visible.length - 1;

            return (
              <motion.div
                key={q.id}
                style={{
                  height: ITEM_HEIGHT,
                }}
                initial={enterFrom(isNewest, visible.length, yTarget)}
                animate={{ y: yTarget, opacity: 1 }}
                exit={{ y: -ITEM_HEIGHT - 24, opacity: 1 }}
                transition={{ duration: 0.3, damping: 20, type: 'spring' }}
                className={styles.item}
              >
                <div className={styles.itemLeft}>
                  <div className={styles.order}>{baseIndex + index + 1}</div>
                </div>
                <div className={styles.itemRight}>
                  <p className={styles.questionText}>{q.text}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className={styles.bottomInfo}>
        <div className={styles.bottomInfoText}>
          <Clock
            size={13}
            style={{ marginTop: '1px' }}
            color="var(--neutral-5)"
          />
          <p>예상 시간 30초</p>
        </div>
        <div className={styles.progress}>{progress}%</div>
      </div>
    </div>
  );
};

export default GeneratingClient;
