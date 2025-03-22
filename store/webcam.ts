import { humanConfig } from '@/utils/constants/human.config';
import type { Human } from '@vladmandic/human';
import { atom } from 'jotai';

export const humanInstanceAtom = atom<Human>();

export const humanClientAtom = atom(null as unknown as Human);
export const initHumanAtom = atom(
  (get) => get(humanClientAtom),
  (get, set, update: Human) => {
    set(humanClientAtom, update);
  },
);

initHumanAtom.onMount = (set) => {
  (async () => {
    if (typeof window !== 'undefined') {
      console.log('human 로딩중');
      const H = await import('@vladmandic/human');
      const human = new H.default(humanConfig) as Human;
      await human.load();

      set(human);
      console.log('human 로딩완료');
    }
  })();
};
