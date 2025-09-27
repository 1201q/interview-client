// export const user

import { atom } from 'jotai';

export type RequestStage =
  | 'resumeText'
  | 'jobText'
  | 'beforeGenerating'
  | 'generating'
  | 'selecting';

export const currentRequestStageAtom = atom<RequestStage>('resumeText');

export const generatingProgressAtom = atom(0);

generatingProgressAtom.onMount = (set) => {
  return () => {
    set(0);
    console.log('generatingProgressAtom unmounted, reset to 0');
  };
};
