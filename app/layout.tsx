import './globals.css';

import localFont from 'next/font/local';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import JotaiProvider from '@/components/shared/JotaiProvider';
import { cookies } from 'next/headers';

interface Props {
  children: React.ReactNode;
  modal: React.ReactNode;
}

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export default async function RootLayout({ children, modal }: Readonly<Props>) {
  const sb =
    (await cookies()).get('sidebar-size')?.value === 'mini'
      ? 'mini'
      : 'expanded';
  // 없으면 expanded

  const width = sb === 'mini' ? '60px' : '280px';

  return (
    <html
      lang="ko"
      data-sidebar-size={sb}
      style={{ ['--sidebar-w' as any]: width }}
    >
      <body className={pretendard.variable}>
        <JotaiProvider>
          <SpeedInsights />
          <Analytics />
          {children}
          {modal}
        </JotaiProvider>
      </body>
    </html>
  );
}
