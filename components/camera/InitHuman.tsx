'use client';

import { initHumanAtom } from '@/store/webcam';
import { useAtomValue } from 'jotai';

const InitHuman = () => {
  const humanInit = useAtomValue(initHumanAtom);

  return <></>;
};

export default InitHuman;
