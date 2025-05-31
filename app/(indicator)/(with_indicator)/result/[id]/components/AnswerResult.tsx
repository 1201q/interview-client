import { useEffect, useRef, useState } from 'react';
import styles from './styles/answer.result.module.css';
import { useAtomValue } from 'jotai';
import { selectedAnswerAtom } from '@/store/result';
import Button from '@/components/common/Button';
import Play from '@/public/play.svg';
import Stop from '@/public/stop.svg';
import { getAudio } from '@/utils/services/analysis';
import { AnalysisResult } from '@/utils/types/types';

// http://localhost:3000/result/170a7fc0-6cc7-4c6f-a170-35ec2a4caff7

const AnswerResult = () => {
  const selected = useAtomValue(selectedAnswerAtom);
  const [isAudioPlay, setIsAudioPlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const getParsedData = (analysisResult?: string) => {
    try {
      if (!analysisResult) return null;
      const parsed: AnalysisResult = JSON.parse(analysisResult);

      return parsed ?? null;
    } catch {
      return null;
    }
  };

  const test = JSON.parse(selected?.analysis_result);

  console.log(test);

  const renderWords = getParsedData(selected?.analysis_result)?.words;

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initAudio = async () => {
      if (selected?.analysis_status === 'completed' && audioRef.current) {
        const blob = await getAudio(selected.id);
        const url = URL.createObjectURL(blob);
        audioRef.current.src = url;
        setIsAudioPlay(false);
      }
    };

    initAudio();
  }, [selected, selected?.analysis_status]);

  useEffect(() => {
    if (!audioRef.current) return;

    const handlePlay = () => setIsAudioPlay(true);
    const handlePause = () => setIsAudioPlay(false);
    const handleEnded = () => setIsAudioPlay(false);

    audioRef.current.addEventListener('play', handlePlay);
    audioRef.current.addEventListener('pause', handlePause);
    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      audioRef.current?.removeEventListener('play', handlePlay);
      audioRef.current?.removeEventListener('pause', handlePause);
      audioRef.current?.removeEventListener('ended', handleEnded);
    };
  }, [audioRef.current]);

  return (
    <div className={styles.container}>
      <div className={styles.questionContainer}>
        <p>질문</p>
        <span>{selected?.question.question_text}</span>
      </div>
      <div className={styles.questionContainer}>
        <p>내 답변</p>
        <div className={styles.answerContainer}>
          {renderWords &&
            renderWords.map((w) => {
              const isSpeaking = currentTime >= w.start;

              return (
                <span
                  onClick={() => {
                    if (isAudioPlay && audioRef.current) {
                      audioRef.current.currentTime = w.start;
                      audioRef.current.play();
                    }
                  }}
                  className={
                    isAudioPlay
                      ? isSpeaking
                        ? styles.highlight
                        : styles.gray
                      : ''
                  }
                  key={`${w.start}/${w.after}`}
                >
                  {w.after}
                </span>
              );
            })}
        </div>
      </div>
      <div>
        <Button
          onClick={() => {
            if (audioRef.current) {
              if (isAudioPlay) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
              } else {
                audioRef.current.play();
              }
            }
          }}
          text={isAudioPlay ? '일시정지' : '재생'}
          icon={isAudioPlay ? <Stop /> : <Play />}
          disabled={false}
        />
        {selected?.analysis_status === 'completed' && <audio ref={audioRef} />}
      </div>
    </div>
  );
};

export default AnswerResult;
