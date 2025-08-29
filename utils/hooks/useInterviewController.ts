import {
  ClientInterviewPhaseAtom,
  CurrentSessionQuestionAtom,
  InterviewJobRoleAtom,
  KeywordsForSttAtom,
  RefreshSessionQuestionsAtom,
  SessionIdAtom,
  StartAnswerCountdownAtom,
  StartInterviewSessionAtom,
  SubmitAnswerAtom,
} from '@/store/interviewSession';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranscribe } from './useTranscribe';
import { InterviewPhase as InterviewPhaseType } from '@/utils/types/interview';
import { useTimerController } from './useTimerController';

type SideComponent = 'transcrie' | 'questionList';

export const useInterviewController = () => {
  // -------------- jotai atoms --------------
  const [phase, setPhase] = useAtom(ClientInterviewPhaseAtom);
  const sessionId = useAtomValue(SessionIdAtom);
  const question = useAtomValue(CurrentSessionQuestionAtom);
  const jobRole = useAtomValue(InterviewJobRoleAtom);
  const keywords = useAtomValue(KeywordsForSttAtom);

  const doRefreshQuestions = useSetAtom(RefreshSessionQuestionsAtom);
  const doStartInterviewSession = useSetAtom(StartInterviewSessionAtom);
  const doStartAnswerCountdown = useSetAtom(StartAnswerCountdownAtom);
  const doSubmitAnswer = useSetAtom(SubmitAnswerAtom);

  // -------------- ui states --------------
  const [cameraOn, setCameraOn] = useState(false);
  const [expanded, setExpanded] = useState<SideComponent[]>([]);
  const togglePanel = useCallback((id: SideComponent) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }, []);

  const isBelowTextVisible = useMemo(
    () =>
      (['startCountdown3', 'answering'] as InterviewPhaseType[]).includes(
        phase,
      ),
    [phase],
  );
  const isOverlayTextVisible = useMemo(
    () => (['start', 'starting'] as InterviewPhaseType[]).includes(phase),
    [phase],
  );

  // -------------- stt hook --------------
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

  // -------------- stt 토큰 컨텍스트 --------------
  const sttBias = useMemo(() => {
    const qText = question?.text ?? '';
    const keyword =
      keywords.find((k) => k.id === question?.question_id)?.stt_keywords ?? [];

    return {
      jobRole: jobRole ?? '',
      questionText: qText,
      keywords: keyword,
    };
  }, [jobRole, question?.id, question?.text, keywords]);

  // -------------- 가드 --------------
  // 중복 방지
  const runIdRef = useRef(0);
  const run = () => (runIdRef.current += 1);

  // ----------⏱️ 타이머 ----------
  const onTimerComplete = useCallback(() => {
    if (phase === 'start') {
      startCountdown();
    } else if (phase === 'answering') {
      submitAnswer();
    }
  }, [phase]);

  const timer = useTimerController({ fps: 10, onComplete: onTimerComplete });

  // -------------- 액션 --------------

  const startInterview = useCallback(() => {
    if (phase !== 'beforeStart') return;
    doStartInterviewSession();
  }, [phase, doStartInterviewSession]);

  const startCountdown = useCallback(async () => {
    if (phase !== 'start' || !question) return;

    const currentRun = run();
    setPhase('starting');

    try {
      // 1. 컨텍스트와 함께 토큰 발급
      await connectTranscription(sttBias);

      // 2. 오디오 소스 준비
      await prepareAudioTrack('tab');

      // 3. 현재 질문을 answering으로 변경 -> 성공시 카운트 다운
      await doStartAnswerCountdown();

      if (runIdRef.current !== currentRun) return;

      setPhase('startCountdown3');
    } catch (error) {
      if (runIdRef.current !== currentRun) return;
      setPhase('start');
    }
  }, [
    phase,
    question,
    connectTranscription,
    prepareAudioTrack,
    doStartAnswerCountdown,
    setPhase,
    sttBias,
  ]);

  const startAnswer = useCallback(() => {
    if (!canResume) throw new Error('stt 미연결2');
    resumeTranscription();
    setPhase('answering');
  }, [canResume, resumeTranscription, setPhase]);

  const submitAnswer = useCallback(async () => {
    if (phase !== 'answering') return;
    setPhase('submitting');

    try {
      const data = await flushAndStop();
      await doSubmitAnswer({
        audioBlob: data.audioBlob,
        answerText: data.text,
      });

      await doRefreshQuestions();
      resetText();
      setCameraOn(false);
    } catch (error) {
      setPhase('answering');
    }
  }, [
    phase,
    flushAndStop,
    doSubmitAnswer,
    doRefreshQuestions,
    resetText,
    setPhase,
  ]);

  // -------------- phase 상태 관리 --------------
  useEffect(() => {
    if (phase === 'startCountdown3') setCameraOn(true);
    if (phase === 'submitting') setCameraOn(false);

    switch (phase) {
      case 'start':
        console.log('start1');
        timer.start(60_000);
        break;
      case 'answering':
        console.log('start2');
        timer.start(60_000);
        break;
      case 'starting':
      case 'submitting':
        console.log('stop');
        timer.stop();
        break;
      case 'startCountdown3':
      case 'submitSuccess':
    }
  }, [phase]);

  // -------------- phase 상태 관리 --------------

  const interview = {
    phase,
    question,
    jobRole,
    sessionId,
  };

  const action = {
    startInterview,
    startCountdown,
    startAnswer,
    submitAnswer,
  };

  const ui = {
    cameraOn,
    expanded,
    togglePanel,
    isBelowTextVisible,
    isOverlayTextVisible,
  };

  const stt = {
    canResume,
    isRecording,
    connected,
    stableText: stable,
    liveText: live,
    rawStableData,
  };

  const time = {
    barProgress: timer.progress,
    remainingSec: timer.remainingSec,
  };

  return { interview, action, ui, stt, time };
};
