'use client';

import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import type { Human, Config } from '@vladmandic/human';

const config: Partial<Config> = {
  debug: true,
  modelBasePath: 'https://vladmandic.github.io/human/models/', // 모델 기본 경로
  face: { enabled: true },
};

interface Props {
  videoRef: RefObject<HTMLVideoElement | null>;
}

// eslint-disable-next-line react/prop-types
const RunHuman: React.FC<Props> = ({ videoRef }) => {
  const [human, setHuman] = useState<Human | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadHuman = async () => {
      if (typeof window !== 'undefined') {
        const H = await import('@vladmandic/human');
        const humanInstance = new H.default(config) as Human;
        await humanInstance.load();
        setHuman(humanInstance);
        setIsReady(true);
        console.log('Human 모델 로드 완료');
      }
    };

    loadHuman();
  }, []);

  const detect = async () => {
    // eslint-disable-next-line react/prop-types
    if (!human || !videoRef.current) return;

    // eslint-disable-next-line react/prop-types
    const result = await human.detect(videoRef.current);
    console.log('Detection Result:', result);

    // 얼굴 감지 정보 출력
    const faces = result.face || [];
    console.log('Detected Faces:', faces.length);
    faces.forEach((face, i) => {
      console.table({
        face: i + 1,
        gender: face.gender,
        score: face.score,
        embedding_length: face.embedding?.length,
      });
    });
  };

  return (
    <div>
      <button onClick={detect} disabled={!isReady}>
        얼굴 감지 시작
      </button>
    </div>
  );
};

export default RunHuman;
