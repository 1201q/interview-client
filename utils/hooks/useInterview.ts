import { answerEnd$, answerStart$ } from '@/store/observable/raw';
import { recordedFaceData$ } from '@/store/observable/result';
import { useTranscribe } from '@/utils/hooks/useTranscribe';

import {
  getInterviewSessionDetail,
  startAnswer,
  startInterviewSession,
  submitAnswer,
} from '@/utils/services/interviewSession';
import {
  InterviewPhase,
  InterviewSessionStatus,
  SessionQuestionItemWithAnswerId,
} from '@/utils/types/interview';
import { useRouter } from 'next/navigation';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FaceFrameState } from '../types/analysis';

interface InterviewInitProps {
  sessionId: string;
  questions: SessionQuestionItemWithAnswerId[];
  status: InterviewSessionStatus;
}

type CameraObjectFit = 'cover' | 'contain';

const LOCALSTORAGE_PREFIX = 'useInterview_';

const makeKey = (sessionId: string) => `${LOCALSTORAGE_PREFIX}/${sessionId}`;

const readLocalStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const writeLocalStorage = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('Failed to write localStorage');
  }
};

export const useInterview = ({
  questions,
  sessionId,
  status,
}: InterviewInitProps) => {
  const router = useRouter();
  const [clientQuestions, setClientQuestions] = useState(questions);
  const currentQuestion = clientQuestions.find(
    (q) => q.status === 'ready' || q.status === 'answering',
  );

  const [visibleQuestionList, setVisibleQuestionList] = useState(true);
  const [visibleSttComponent, setVisibleSttComponent] = useState(true);
  const [cameraObjectFitOpt, setCameraObjectFitOpt] =
    useState<CameraObjectFit>('cover');

  const [serverStatus, setServerStatus] = useState(status);
  const [clientPhase, setClientPhase] = useState<InterviewPhase>('beforeStart');

  const localStorageKey = useMemo(() => makeKey(sessionId), [sessionId]);

  const faceDataRef = useRef<FaceFrameState[] | null>(null);

  useEffect(() => {
    const sub = recordedFaceData$.subscribe((data) => {
      faceDataRef.current = data;
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const data = readLocalStorage(localStorageKey, {
      visibleQuestionList: false,
      visibleSttComponent: false,
      cameraObjectFitOpt: 'cover' as CameraObjectFit,
    });

    setVisibleQuestionList(data.visibleQuestionList);
    setVisibleSttComponent(data.visibleSttComponent);
    setCameraObjectFitOpt(data.cameraObjectFitOpt);
  }, [localStorageKey]);

  useEffect(() => {
    writeLocalStorage(localStorageKey, {
      visibleQuestionList,
      visibleSttComponent,
      cameraObjectFitOpt,
    });
  }, [
    localStorageKey,
    visibleQuestionList,
    visibleSttComponent,
    cameraObjectFitOpt,
  ]);

  const {
    connected,
    isRecording,
    canResume,
    stable,
    live,
    rawLiveData,
    rawStableData,
    flushAndStop,
    resumeTranscription,
    connectTranscription,
    prepareAudioTrack,
    resetText,
  } = useTranscribe({
    onEvent: (e: any) => {},
  });

  const doStartSession = async () => {
    try {
      setClientPhase('beforeStartLoading');
      await startInterviewSession(sessionId);
      refresh();

      setClientPhase('start');
    } catch (error) {
      setClientPhase('beforeStart');
    }
  };

  const refresh = async () => {
    const res = await getInterviewSessionDetail(sessionId);

    setClientQuestions(res.questions);
    setServerStatus(res.status);
  };

  const doStartCountdown = async () => {
    if (!currentQuestion) return;

    try {
      setClientPhase('starting');

      // 1. 컨텍스트와 함께 토큰 발급

      await connectTranscription({});

      // 2. 오디오 소스 준비

      await prepareAudioTrack('mic');

      // 3. 현재 질문을 answering으로 변경 -> 성공시 카운트 다운

      await startAnswer(currentQuestion.answer_id);

      setClientPhase('startCountdown3');
    } catch (error) {
      console.log(error);
      setClientPhase('start');
    }
  };

  const doStartAnswer = async () => {
    answerStart$.next();

    resumeTranscription();
    setClientPhase('answering');

    refresh();
  };

  const doSubmitAnswer = async () => {
    if (!currentQuestion) return;

    try {
      setClientPhase('submitting');

      answerEnd$.next();

      const data = await flushAndStop();
      const result = await submitAnswer({
        answerId: currentQuestion.answer_id,
        audioBlob: data.audioBlob,
        answerText: data.text,
        faceData: faceDataRef.current,
      });

      if (!result.finished) {
        refresh();
        setClientPhase('submitSuccess');

        setTimeout(() => setClientPhase('start'), 1200);
      } else {
        refresh();
        setClientPhase('submitSuccess');

        setTimeout(() => setClientPhase('end'), 1200);
      }
    } catch (error) {
      setClientPhase('answering');
    }
  };

  const doComplete = () => {
    router.push(`/feedback/${sessionId}/progress`);
  };

  const toggleQuestionList = () => {
    setVisibleQuestionList((prev) => !prev);
  };

  const toggleSttComponent = () => {
    setVisibleSttComponent((prev) => !prev);
  };

  const toggleCameraObjectFit = () => {
    setCameraObjectFitOpt((prev) => (prev === 'cover' ? 'contain' : 'cover'));
  };

  return {
    currentQuestion,
    clientQuestions,
    serverStatus,
    clientPhase,
    doStartSession,
    doStartAnswer,
    doStartCountdown,
    doSubmitAnswer,
    doComplete,

    rawStableData,

    visibleQuestionList,
    toggleQuestionList,

    visibleSttComponent,
    toggleSttComponent,

    cameraObjectFitOpt,
    toggleCameraObjectFit,

    sessionId,
  };
};
