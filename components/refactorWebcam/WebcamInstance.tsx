import { useAtomValue } from 'jotai';
import { initHumanAtom, isHumanLoadedAtom } from '@/store/webcam';

import Webcam from './Webcam';

interface DrawTargets {
  face?: boolean;
  body?: boolean;
  hand?: boolean;
}

interface Props {
  isRunning: boolean;
  drawTargets?: DrawTargets;
  cameraObjectFitOpt?: 'cover' | 'contain';
}

const WebcamInstance = ({
  isRunning,
  drawTargets = { face: true, body: true, hand: true },
  cameraObjectFitOpt = 'cover',
}: Props) => {
  useAtomValue(initHumanAtom);

  const isHumanLoaded = useAtomValue(isHumanLoadedAtom);

  if (isHumanLoaded) {
    return (
      <Webcam
        cameraObjectFitOpt={cameraObjectFitOpt}
        isRunning={isRunning}
        drawTargets={drawTargets}
      />
    );
  }

  return null;
};

export default WebcamInstance;
