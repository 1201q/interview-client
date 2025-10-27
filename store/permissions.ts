import { atom } from 'jotai';

export type GuardPhase =
  | 'idle'
  | 'loading'
  | 'need-permission'
  | 'requesting'
  | 'ready'
  | 'degraded'
  | 'revoked'
  | 'error';

export type Reason =
  | null
  | 'camera-denied'
  | 'mic-denied'
  | 'device-lost'
  | 'track-ended'
  | 'permissions-revoked'
  | 'unknown';

export const guardPhaseAtom = atom<GuardPhase>('idle');
export const guardReasonAtom = atom<Reason>(null);

export const overlayVisibleAtom = atom((get) => {
  const p = get(guardPhaseAtom);
  return !(p === 'ready' || p === 'idle');
});
