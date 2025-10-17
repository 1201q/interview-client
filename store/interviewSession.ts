import {
  getInterviewSessionDetail,
  startAnswer,
  startInterviewSession,
  submitAnswer,
  testSubmitAnswer,
} from '@/utils/services/interviewSession';
import {
  InterviewInitStatus,
  InterviewPhase,
  InterviewSessionStatus,
  QSessionQuestionItem,
  SessionQuestionItemWithAnswerId,
} from '@/utils/types/interview';
import { atom } from 'jotai';

export const SessionIdAtom = atom<string | null>(null);

SessionIdAtom.onMount = (set) => {
  return () => {
    console.log('SessionIdAtom unmount');
    set(null);
  };
};

export const InterviewInitAtom = atom<InterviewInitStatus>('beforeInit');

export const InterviewJobRoleAtom = atom<string | undefined>();
export const KeywordsForSttAtom = atom<
  { id: string; stt_keywords: string[] }[]
>([]);

// 메인 질문
export const SessionQuestionsAtom = atom<SessionQuestionItemWithAnswerId[]>([]);

export const CurrentSessionQuestionAtom = atom<
  SessionQuestionItemWithAnswerId | undefined
>((get) =>
  get(SessionQuestionsAtom).find(
    (sq) => sq.status === 'ready' || sq.status === 'answering',
  ),
);

InterviewInitAtom.onMount = (set) => {
  return () => {
    console.log('InterviewInitAtom unmount');
    set('beforeInit');
  };
};

// interview session
export const ClientInterviewPhaseAtom = atom<InterviewPhase>('beforeStart');

export const ServerInterviewSessionStatusAtom =
  atom<InterviewSessionStatus>('not_started');

export const StartInterviewSessionAtom = atom(null, async (get, set) => {
  const clientPhase = get(ClientInterviewPhaseAtom);
  const sessionId = get(SessionIdAtom);

  if (clientPhase !== 'beforeStart') return;
  if (!sessionId) return;

  set(ClientInterviewPhaseAtom, 'beforeStartLoading');

  try {
    await startInterviewSession(sessionId);

    if (get(ClientInterviewPhaseAtom) !== 'beforeStartLoading') return;

    set(RefreshSessionQuestionsAtom);
    set(ClientInterviewPhaseAtom, 'start');
  } catch (error) {
    set(ClientInterviewPhaseAtom, 'beforeStart');
  }
});

// 인터뷰 질문
// session Question
export const RefreshSessionQuestionsAtom = atom(null, async (get, set) => {
  const sessionId = get(SessionIdAtom);
  if (!sessionId) return;

  try {
    const res = await getInterviewSessionDetail(sessionId);

    // questions
    set(SessionQuestionsAtom, res.questions);

    // status
    set(ServerInterviewSessionStatusAtom, res.status);
  } catch (error) {}
});

// 인터뷰
// 상태를 answering으로 변경함 -> 성공시 countdown 3로 변경
export const StartAnswerCountdownAtom = atom(null, async (get) => {
  const sessionId = get(SessionIdAtom);
  const currentQuestion = get(CurrentSessionQuestionAtom);
  const clientPhase = get(ClientInterviewPhaseAtom);

  if (clientPhase !== 'starting') return;
  if (!currentQuestion) return;
  if (!sessionId) return;

  try {
    await startAnswer(currentQuestion.id);
  } catch (error) {
    console.log(error);
  }
});

export const SubmitAnswerAtom = atom(
  null,
  async (get, set, update: { audioBlob: Blob | null; answerText: string }) => {
    const currentQuestion = get(CurrentSessionQuestionAtom);
    const clientPhase = get(ClientInterviewPhaseAtom);
    const sessionId = get(SessionIdAtom);

    if (!sessionId) return;
    if (clientPhase !== 'submitting') return;
    if (!currentQuestion) return;

    try {
      const res = await submitAnswer({
        answerId: currentQuestion.answer_id,
        audioBlob: update.audioBlob,
        answerText: update.answerText,
      });

      if (!res.finished) {
        set(RefreshSessionQuestionsAtom);
      }

      set(ClientInterviewPhaseAtom, 'submitSuccess');

      setTimeout(() => set(ClientInterviewPhaseAtom, 'start'), 1200);
    } catch (error) {
      set(ClientInterviewPhaseAtom, 'answering');
    }
  },
);
