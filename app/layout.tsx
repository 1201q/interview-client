import './globals.css';

import localFont from 'next/font/local';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

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

export default function RootLayout({ children, modal }: Readonly<Props>) {
  return (
    <html lang="ko">
      <body className={pretendard.variable}>
        <SpeedInsights />
        <Analytics />
        {children}
        {modal}
      </body>
    </html>
  );
}
