import { useAtomValue } from 'jotai';
import { humanClientAtom, isHumanLoadedAtom } from '@/store/webcam';

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
  const isHumanLoaded = useAtomValue(isHumanLoadedAtom);
  const human = useAtomValue(humanClientAtom);

  if (isHumanLoaded && human) {
    return (
      <Webcam
        human={human}
        cameraObjectFitOpt={cameraObjectFitOpt}
        isRunning={isRunning}
        drawTargets={drawTargets}
      />
    );
  }

  return null;
};

export default WebcamInstance;
