import CameraClient from '@/components/camera/CameraClient';
import WebcamClient from '@/components/camera/WebcamClient';

export default async function Home() {
  return (
    <div>
      <WebcamClient />
    </div>
  );
}
