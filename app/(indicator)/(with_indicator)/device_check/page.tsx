'use client';
import { useStt } from './_components/hooks/useStt';

const PAge = () => {
  const { startRecording, stopRecording } = useStt();

  return (
    <div>
      <button onClick={startRecording}>시작</button>
      <button onClick={stopRecording}>종료</button>
    </div>
  );
};

export default PAge;
