import {
  getInterviewSessionDetail,
  startAnswer,
  startInterviewSession,
} from '@/utils/services/interviewSession';
import {
  InterviewInitStatus,
  InterviewPhase,
  InterviewSessionStatus,
  QSessionQuestionItem,
} from '@/utils/types/interview';
import { atom } from 'jotai';

export const InterviewInitAtom = atom<InterviewInitStatus>('beforeInit');

export const InterviewJobRoleAtom = atom<string | undefined>();
export const KeywordsForSttAtom = atom<
  { id: string; stt_keywords: string[] }[]
>([]);

// 메인 질문
export const SessionQuestionsAtom = atom<QSessionQuestionItem[]>([]);

export const CurrentSessionQuestionAtom = atom<
  QSessionQuestionItem | undefined
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

export const StartInterviewSessionAtom = atom(
  null,
  async (get, set, sessionId: string) => {
    const clientPhase = get(ClientInterviewPhaseAtom);

    if (clientPhase !== 'beforeStart') return;

    set(ClientInterviewPhaseAtom, 'beforeStartLoading');

    try {
      await startInterviewSession(sessionId);

      if (get(ClientInterviewPhaseAtom) !== 'beforeStartLoading') return;

      set(RefreshSessionQuestionsAtom, sessionId);
      set(ClientInterviewPhaseAtom, 'start');
    } catch (error) {
      set(ClientInterviewPhaseAtom, 'beforeStart');
    }
  },
);

// 인터뷰 질문
// session Question
export const RefreshSessionQuestionsAtom = atom(
  null,
  async (get, set, sessionId: string) => {
    try {
      const res = await getInterviewSessionDetail(sessionId);

      // questions
      set(SessionQuestionsAtom, res.questions);

      // status
      set(ServerInterviewSessionStatusAtom, res.status);
    } catch (error) {}
  },
);

// 인터뷰
// 상태를 answering으로 변경함 -> 성공시 countdown 3로 변경
export const StartAnswerCountdownAtom = atom(
  null,
  async (get, set, sessionId: string) => {
    const currentQuestion = get(CurrentSessionQuestionAtom);
    const clientPhase = get(ClientInterviewPhaseAtom);

    if (clientPhase !== 'start') return;
    if (!currentQuestion) return;

    try {
      set(ClientInterviewPhaseAtom, 'starting');

      await startAnswer(sessionId, currentQuestion.id);

      // 성공하면 countdown 진입.
      set(ClientInterviewPhaseAtom, 'startCountdown3');
    } catch (error) {
      set(ClientInterviewPhaseAtom, 'start');
    }
  },
);
