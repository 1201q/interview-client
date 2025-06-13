import { useAtomValue } from 'jotai';
import { initHumanAtom, isHumanLoadedAtom } from '@/store/webcam';

import RWebcam from './Webcam';

interface DrawTargets {
  face?: boolean;
  body?: boolean;
  hand?: boolean;
}

interface Props {
  isRunning: boolean;
  drawTargets?: DrawTargets;
}

const WebcamInstance = ({
  isRunning,
  drawTargets = { face: true, body: true, hand: true },
}: Props) => {
  useAtomValue(initHumanAtom);

  const isHumanLoaded = useAtomValue(isHumanLoadedAtom);

  if (isHumanLoaded) {
    return <RWebcam isRunning={isRunning} drawTargets={drawTargets} />;
  }

  return null;
};

export default WebcamInstance;
