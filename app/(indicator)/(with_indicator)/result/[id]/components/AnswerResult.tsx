import { useEffect, useRef, useState } from 'react';
import styles from './styles/answer.result.module.css';
import { useAtomValue } from 'jotai';
import { selectedAnswerAtom } from '@/store/result';
import Button from '@/components/common/Button';
import Play from '@/public/play.svg';
import Stop from '@/public/stop.svg';
import { getAudio } from '@/utils/services/analysis';
import { SegmentsType, WhisperSttType, WordsType } from '@/utils/types/types';

const AnswerResult = () => {
  const selected = useAtomValue(selectedAnswerAtom);
  const [isAudioPlay, setIsAudioPlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const getParsedData = (analysisResult?: string) => {
    try {
      if (!analysisResult) return null;
      const parsed: WhisperSttType = JSON.parse(analysisResult);

      return parsed ?? null;
    } catch {
      return null;
    }
  };

  const words = getParsedData(selected?.analysis_result)?.words;
  const segments = getParsedData(selected?.analysis_result)?.segments;

  const getRenderWords = (
    expected: string[][],
    words: { start: number; end: number; word: string }[],
    maxLookahead = 4,
  ) => {
    const result: {
      word: string;
      isSpoken: boolean;
      start?: number;
      end?: number;
    }[][] = [];

    let wordIndex = 0;

    const normalize = (s: string) =>
      s.replace(/[^\p{L}\p{N}ㄱ-ㅎ가-힣a-zA-Z0-9]/gu, '').toLowerCase();

    for (const group of expected) {
      const groupResult = [];

      for (const target of group) {
        const cleanTarget = normalize(target);
        let matched = false;

        for (let lookahead = 1; lookahead <= maxLookahead; lookahead++) {
          const candidates = words.slice(wordIndex, wordIndex + lookahead);
          const joined = normalize(candidates.map((w) => w.word).join(''));

          if (joined === cleanTarget) {
            groupResult.push({
              word: target,
              isSpoken: true,
              start: candidates[0].start,
              end: candidates[candidates.length - 1].end,
            });

            wordIndex += lookahead;
            matched = true;
            break;
          }
        }

        if (!matched) {
          // Whisper에 해당 단어가 없음
          groupResult.push({
            word: target,
            isSpoken: false,
          });
        }
      }

      result.push(groupResult);
    }

    return result;
  };

  const array = segments?.map((s) => s.text.trim().split(' '));
  const renderWords = array && words && getRenderWords(array, words);
  const flatWords = renderWords?.flatMap((data) => data);

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
          {flatWords &&
            flatWords.map((w: any) => {
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
                  key={`${w.start}/${w.word}`}
                >
                  {w.word}
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
