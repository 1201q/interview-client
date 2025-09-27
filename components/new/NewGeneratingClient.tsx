'use client';

import {
  currentRequestStageAtom,
  generatingProgressAtom,
} from '@/store/request-stage';
import { useAtom, useSetAtom } from 'jotai';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';

import styles from './styles/generating.module.css';
import { v4 as uuid } from 'uuid';
import { GeneratedQuestionItem } from '@/utils/types/types';
import { LoaderCircle } from 'lucide-react';
import { useStableSSE } from '@/utils/hooks/useStableSSE';
import { useRouter } from 'next/navigation';

const MAX_VISIBLE_QUESTIONS = 3;
const ITEM_HEIGHT = 130;
const GAP = 12;
const PADDING = 10;
const HEIGHT =
  ITEM_HEIGHT * MAX_VISIBLE_QUESTIONS +
  GAP * (MAX_VISIBLE_QUESTIONS - 1) +
  PADDING * 2;

interface GeneratingProps {
  questions: GeneratedQuestionItem[];
}

interface Props {
  id: string;
}

const NewGeneratingClient = ({ id }: Props) => {
  const [requestStage, setRequestStage] = useAtom(currentRequestStageAtom);
  const [generatedQuestions, setGeneratedQuestions] = useState<
    GeneratedQuestionItem[]
  >([]);

  const router = useRouter();

  const setProgress = useSetAtom(generatingProgressAtom);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/generate-question/test/${id}?mock=true`;

  useStableSSE(url, {
    onOpen: () => {
      setRequestStage('generating');
    },
    onNamed: {
      question: (data) => {
        setGeneratedQuestions((prev) => [...prev, { ...data, id: uuid() }]);
      },

      progress: (data) => {
        if (data?.limitCount) {
          setProgress(Math.floor((data.createdTotal / data.limitCount) * 100));
        }
      },

      done: () => {
        setProgress(100);
        setRequestStage('selecting');
        router.replace(`/new/${id}/select`);
      },
    },

    onError: (error) => {
      console.warn('SSE error:', error);
    },
  });

  return (
    <div className="animationContainer">
      <AnimatePresence mode="popLayout" initial={false}>
        {requestStage === 'beforeGenerating' && (
          <motion.div
            key="before-generating"
            initial="enter"
            animate="center"
            exit="exit"
            className="spaceBetween"
          >
            <BeforeGenerating />
          </motion.div>
        )}
        {requestStage === 'generating' && (
          <motion.div
            key="before-generating"
            initial="enter"
            animate="center"
            exit="exit"
            className="spaceBetween"
          >
            <Generating questions={generatedQuestions} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BeforeGenerating = () => {
  return (
    <div>
      <p className="stepText">STEP 3 OF 4</p>
      <p className="title">이력서와 채용공고를 꼼꼼히 보고있어요.</p>
      <p className="desc">잠시만 기다려주세요.</p>
    </div>
  );
};

const Generating = ({ questions }: GeneratingProps) => {
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
                  <div className={styles.row}>
                    <p className={styles.basedonText}>{q.based_on}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
          style={{ display: 'flex' }}
        >
          <LoaderCircle color="var( --neutral-4)" size={40} strokeWidth={2} />
        </motion.div>
      </div>
    </div>
  );
};

export default NewGeneratingClient;
