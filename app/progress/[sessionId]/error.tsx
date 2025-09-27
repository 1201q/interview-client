'use client';

import SharedButton from '@/components/new/Button';
import { BanIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Props {
  error: Error;
}

type ErrorType = 'completed' | 'expired';

const Error = ({ error }: Props) => {
  const router = useRouter();

  const msg = error.message as ErrorType;

  if (msg === 'expired') {
    return (
      <main className="main">
        <div className="guide">
          <div className="guideIcon">
            <BanIcon color="var(--neutral-5)" size={60} />
          </div>
          <p className="guideTitle">기간이 만료된 면접 세션입니다.</p>
          <p className="guideDesc">
            해당 면접 세션은 만료되어 접근할 수 없습니다.
          </p>
          <div className="buttons">
            <SharedButton
              text="메인으로"
              color="gray"
              onClick={() => router.replace('/')}
            />
          </div>
        </div>
      </main>
    );
  } else if (msg === 'completed') {
    return (
      <main className="main">
        <div className="guide">
          <div className="guideIcon">
            <BanIcon color="var(--neutral-5)" size={60} />
          </div>
          <p className="guideTitle">이미 완료된 면접 세션입니다.</p>
          <p className="guideDesc">
            해당 면접 세션은 완료되어 접근할 수 없습니다.
          </p>
          <div className="buttons">
            <SharedButton
              text="메인으로"
              color="gray"
              onClick={() => router.replace('/')}
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="main">
      <div className="guide">
        <div className="guideIcon">
          <BanIcon color="var(--neutral-5)" size={60} />
        </div>
        <p className="guideTitle">찾을 수 없는 면접 세션입니다.</p>
        <p className="guideDesc">해당 면접 세션은 존재하지 않습니다.</p>
        <div className="buttons">
          <SharedButton
            text="메인으로"
            color="gray"
            onClick={() => router.replace('/')}
          />
        </div>
      </div>
    </main>
  );
};

export default Error;
