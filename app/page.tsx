import WebcamClient from '@/components/camera/WebcamClient';

export default async function Home() {
  return (
    <div style={{ width: '100%', height: '100dvh' }}>
      <WebcamClient />
    </div>
  );
}
