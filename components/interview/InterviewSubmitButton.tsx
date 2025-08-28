'use client';

import styles from './styles/interview-button.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'motion/react';
import { Loader2, Check, Space } from 'lucide-react';
import { InterviewPhase } from '@/utils/types/interview';

interface SubmitButtonProps {
  phase: InterviewPhase;
  submitAnswer: () => Promise<void>;
  startAnswer: () => void;
  startCountdown: () => Promise<void>;
  startInterview: () => void;
}

const InterviewSubmitButton = ({
  phase,
  startAnswer,
  startCountdown,
  submitAnswer,
  startInterview,
}: SubmitButtonProps) => {
  const countdownControls = useAnimationControls(); // 카운트다운 애니메이션
  const buttonRef = useRef<HTMLButtonElement>(null); // 스페이스바로 버튼 제어
  const [isPressed, setIsPressed] = useState(false); // 스페이스바로 눌림 애니메이션 구현 위함

  const isCountdown = useRef<boolean>(false);

  // =========== button 구분
  const disabledPhases = [
    'beforeStartLoading',
    'starting',
    'startCountdown3',
    'submitting',
    'submitSuccess',
  ] as InterviewPhase[];

  const buttonGroup =
    phase === 'beforeStartLoading' || phase === 'beforeStart'
      ? 'beforeStartGroup'
      : phase === 'answering' ||
          phase === 'submitting' ||
          phase === 'submitSuccess'
        ? 'answerGroup'
        : 'startGroup';

  const isDisabled = disabledPhases.includes(phase);

  // =========== 버튼 클릭 이벤트
  const handleClick = async () => {
    if (phase === 'beforeStart') {
      startInterview();
      console.log('클릭1');
    } else if (phase === 'start') {
      startCountdown();
      console.log('클릭2');
    } else if (phase === 'answering') {
      submitAnswer();
      console.log('클릭3');
    }
  };

  const startCountdownAnimation = useCallback(() => {
    if (isCountdown.current) return;
    isCountdown.current = true;

    countdownControls.set({ x: '0%' });
    countdownControls
      .start({
        x: '-100%',
        transition: { duration: 3, ease: 'linear' },
      })
      .then(() => {
        countdownControls.stop();
        startAnswer();

        isCountdown.current = false;
      });
  }, [countdownControls, startAnswer]);

  useEffect(() => {
    if (phase === 'startCountdown3') {
      startCountdownAnimation();
    }
  }, [phase, startCountdownAnimation]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // 입력창 포커스일 때는 무시
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLButtonElement
      ) {
        return;
      }

      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();

        // disabled가 아닐때만 동작하게
        if (!isDisabled) {
          setIsPressed(true);
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (!isDisabled && isPressed) {
          buttonRef.current?.click();
        }

        setIsPressed(false);
      }
    };

    // 비활성으로 바뀌면 경우 눌림상태 해체
    const onCancel = () => setIsPressed(false);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onCancel);
    document.addEventListener('visibilitychange', onCancel);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onCancel);
      document.removeEventListener('visibilitychange', onCancel);
    };
  }, [isDisabled, isPressed]);

  return (
    <div className={styles.bottomButtonController}>
      <motion.button
        ref={buttonRef}
        onClick={handleClick}
        disabled={isDisabled}
        whileHover={{
          backgroundColor: !isDisabled ? 'rgba(76, 134, 254,0.9)' : '',
        }}
        whileTap={isDisabled ? '' : { scale: 0.94 }}
        animate={
          isPressed
            ? { scale: 0.94, backgroundColor: 'rgba(76, 134, 254,0.9)' }
            : { scale: 1 }
        }
        layout
        transition={{
          type: 'spring',
          layout: { duration: 0.15, ease: 'easeInOut' },
        }}
        className={styles.submitButton}
      >
        <AnimatePresence initial={false} mode="wait">
          {/* 인터뷰  시작 전 */}
          {buttonGroup === 'beforeStartGroup' && (
            <motion.div
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              key="beforeStartGroup"
              style={{ height: '100%', position: 'relative' }}
            >
              {phase === 'beforeStart' && (
                <motion.div
                  layout
                  key={'beforStart'}
                  className={styles.buttonWrapper}
                >
                  <div className={styles.text}>면접 시작하기</div>
                  <div className={styles.iconContainer}>
                    <Space
                      color="white"
                      size={19}
                      style={{ marginBottom: '5px' }}
                    />
                  </div>
                </motion.div>
              )}
              {phase === 'beforeStartLoading' && (
                <motion.div
                  layout
                  key={'beforeStartLoading'}
                  className={styles.buttonWrapper}
                >
                  <div className={styles.text}>면접을 시작 중입니다...</div>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.9,
                      ease: 'linear',
                    }}
                    style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Loader2 color="rgba(255, 255, 255, 0.8)" size={19} />
                  </motion.span>
                </motion.div>
              )}
            </motion.div>
          )}
          {/* 질문 시작 */}
          {buttonGroup === 'startGroup' && (
            <motion.div
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              key="startGroup"
              style={{ height: '100%', position: 'relative' }}
            >
              {/* 답변 시작하기 */}
              {phase === 'start' && (
                <motion.div
                  layout
                  key={'start'}
                  className={styles.buttonWrapper}
                >
                  <div className={styles.text}>답변 시작하기</div>
                  <div className={styles.iconContainer}>
                    <Space
                      color="white"
                      size={19}
                      style={{ marginBottom: '5px' }}
                    />
                  </div>
                </motion.div>
              )}
              {/* 답변 시작 로딩 중 */}
              {phase === 'starting' && (
                <motion.div
                  layout
                  key={'starting'}
                  className={styles.buttonWrapper}
                >
                  <div className={styles.text}>시작 준비 중....</div>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.9,
                      ease: 'linear',
                    }}
                    style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Loader2 color="rgba(255, 255, 255, 0.8)" size={19} />
                  </motion.span>
                </motion.div>
              )}
              {/* 답변 3초 대기 (3초 후 answering)  */}
              {phase === 'startCountdown3' && (
                <motion.div
                  layout
                  key={'startCountdown3'}
                  className={styles.buttonWrapper}
                >
                  <div className={styles.text}>잠시 후 답변을 시작합니다.</div>
                  <motion.div
                    animate={countdownControls}
                    className={styles.barBg}
                  ></motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
          {/*  답변 시작 */}
          {buttonGroup === 'answerGroup' && (
            <motion.div
              key="answeringGroup"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              {/* 답변 제출하기 */}
              {phase === 'answering' && (
                <motion.div
                  layout
                  key={'answering'}
                  className={styles.buttonWrapper}
                >
                  <div className={styles.text}>답변 제출하기</div>
                  <div className={styles.iconContainer}>
                    <Space
                      color="white"
                      size={19}
                      style={{ marginBottom: '5px' }}
                    />
                  </div>
                </motion.div>
              )}
              {/* 답변 제출 로딩 */}
              {phase === 'submitting' && (
                <motion.div
                  layout
                  key={'submitting'}
                  className={styles.buttonWrapper}
                >
                  <div className={styles.text}>답변을 제출 중입니다..</div>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.9,
                      ease: 'linear',
                    }}
                    style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Loader2 color="rgba(255, 255, 255, 0.8)" size={19} />
                  </motion.span>
                </motion.div>
              )}

              {/* 답변 제출 성공 */}
              {phase === 'submitSuccess' && (
                <motion.div
                  layout
                  key={'submitSuccess'}
                  className={styles.buttonWrapper}
                >
                  <div className={styles.text}>제출 성공!</div>
                  <motion.span
                    style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <Check
                      color="rgba(255, 255, 255, 0.8)"
                      size={19}
                      style={{ marginRight: '-2px' }}
                    />
                  </motion.span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default InterviewSubmitButton;
