import { getInterviewSession } from '@/utils/services/interview';
import {
  InterviewClientStatusType,
  InterviewSessionQuestionType,
  InterviewSessionStatusType,
  InterviewSessionType,
} from '@/utils/types/types';
import { atom } from 'jotai';

export const interviewSessionAtom = atom<InterviewSessionType>();

export const fetchInerviewSessionAtom = atom(
  (get) => get(interviewSessionAtom),
  async (get, set) => {
    const sessionId = get(interviewSessionAtom)?.id;

    if (sessionId) {
      const data = await getInterviewSession(sessionId);

      console.log(data);
      set(interviewSessionAtom, data);
    }
  },
);

export const interviewSessionStatusAtom = atom<InterviewSessionStatusType>(
  (get) => get(interviewSessionAtom)?.status ?? 'pending',
);

// questions
export const interviewQuestionsAtom = atom<InterviewSessionQuestionType[]>(
  (get) => get(interviewSessionAtom)?.questions ?? [],
);

// 화면에 표시될 question
export const displayInterviewQuestionAtom = atom<InterviewSessionQuestionType>(
  (get) => {
    const displayData = get(interviewQuestionsAtom).find(
      (q) => q.status === 'ready' || q.status === 'answering',
    );

    if (!displayData) {
      return get(interviewQuestionsAtom)[0];
    }

    return displayData;
  },
);

export const interviewClientStatusAtom =
  atom<InterviewClientStatusType>('ready');

interviewClientStatusAtom.onMount = (set) => {
  return () => {
    set('ready');
  };
};

export const isMicRecordingAtom = atom<boolean>(false);
