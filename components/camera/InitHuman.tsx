'use client';

import { useEffect, useState } from 'react';
import type { Human, Config } from '@vladmandic/human';
import { useSetAtom } from 'jotai';
import { humanInstanceAtom } from '@/store/webcam';

const config: Partial<Config> = {
  debug: true,
  modelBasePath: 'https://cdn.jsdelivr.net/gh/vladmandic/human-models/models/',
  face: {
    enabled: true,
    description: { enabled: false },
    detector: { enabled: false },
  },
  body: { enabled: false },
  hand: { enabled: false },
  object: { enabled: false },
  segmentation: { enabled: false },
  gesture: { enabled: true },
  filter: { enabled: false },
};

const InitHuman = () => {
  const setHuman = useSetAtom(humanInstanceAtom);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadHuman();
  }, []);

  const loadHuman = async () => {
    if (typeof window !== 'undefined') {
      const Library = await import('@vladmandic/human');
      const humanInstance = new Library.default(config) as Human;
      await humanInstance.load();

      setHuman(humanInstance);
      setIsReady(true);

      console.log(humanInstance);
      console.log('Human 모델 로드 완료');
    }
  };

  return <></>;
};

export default InitHuman;
