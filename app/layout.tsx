import './globals.css';

import localFont from 'next/font/local';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import JotaiProvider from '@/components/shared/JotaiProvider';

import { Metadata } from 'next';
import Script from 'next/script';

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

const wanted = localFont({
  src: '../public/fonts/WantedSansVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-wanted',
});

export const metadata: Metadata = {
  title: '디딤 - AI 모의 면접 서비스',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({ children, modal }: Readonly<Props>) {
  return (
    <html lang="ko" data-sidebar-size="mini" suppressHydrationWarning>
      <body className={`${pretendard.variable} ${wanted.variable}`}>
        <JotaiProvider>
          <SpeedInsights />
          <Analytics />
          {children}
          {modal}
          <Script id="sidebar-init" strategy="beforeInteractive">
            {`
          (function() {
            try {
              var v = localStorage.getItem('sidebar-size');
              
              if (v !== 'mini' && v !== 'expanded') v = 'mini';

              var w = v === 'mini' ? '60px' : '280px';

              var html = document.documentElement;
              html.setAttribute('data-sidebar-size', v);
              html.style.setProperty('--sidebar-w', w); 

            } catch (e) {}
          })();
        `}
          </Script>
        </JotaiProvider>
      </body>
    </html>
  );
}
