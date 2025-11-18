'use client';

import { usePathname } from 'next/navigation';
import './layout.css';
import { AnimatePresence, motion, Variants } from 'motion/react';
import RequestHeader from '@/components/newRequest/RequestHeader';
import { useEffect, useMemo, useRef } from 'react';

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

const slideTransition = {
  type: 'tween',
  ease: [0.22, 0.61, 0.36, 1],
  duration: 0.4,
};

function getStepText(pathname: string) {
  if (pathname.includes('/resume')) return 'Step 1/4';
  if (pathname.includes('/job')) return 'Step 2/4';
  if (pathname.includes('/generating')) return 'Step 3/4';
  if (pathname.includes('/select')) return 'Step 4/4';
  return '';
}

const stepIndex = (pathname: string) => {
  if (pathname.includes('/resume')) return 0;
  if (pathname.includes('/job')) return 1;
  return 0;
};

export default function Layout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  const pathname = usePathname();
  const stepText = getStepText(pathname);

  const prevIndexRef = useRef<number>(stepIndex(pathname));
  const currIndex = useMemo(() => stepIndex(pathname), [pathname]);

  // prev => curr 방향 계산
  const direction = useMemo(() => {
    const d = currIndex - prevIndexRef.current;
    return d === 0 ? 1 : Math.sign(d);
  }, [currIndex]);

  useEffect(() => {
    prevIndexRef.current = currIndex;
  }, [currIndex]);

  const isSlidePage = pathname.includes('/resume') || pathname.includes('/job');

  return (
    <div className="container">
      <div className="wrapper">
        <aside className="sidebar">{sidebar}</aside>

        <main className="main">
          <header className="header">
            <RequestHeader text={stepText} />
          </header>
          {isSlidePage ? (
            <div className="slideContents">
              <AnimatePresence
                mode="popLayout"
                initial={false}
                custom={direction}
              >
                <motion.div
                  key={pathname}
                  className="animationContainer"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={slideTransition}
                  custom={direction}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <div className="slideContents">{children}</div>
          )}
        </main>
      </div>
    </div>
  );
}
