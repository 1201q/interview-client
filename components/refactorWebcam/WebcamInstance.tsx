import { useAtomValue } from 'jotai';
import { initHumanAtom, isHumanLoadedAtom } from '@/store/webcam';

import RWebcam from './Webcam';

interface Props {
  isRunning: boolean;
}

const WebcamInstance = ({ isRunning }: Props) => {
  useAtomValue(initHumanAtom);

  const isHumanLoaded = useAtomValue(isHumanLoadedAtom);

  if (isHumanLoaded) {
    return <RWebcam isRunning={isRunning} />;
  }

  return null;
};

export default WebcamInstance;
