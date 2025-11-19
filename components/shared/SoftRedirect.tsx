'use client';

import { useRouter } from 'next/navigation';
import { useEffect, startTransition } from 'react';

type Props = {
  href: string;
  fallback?: React.ReactNode;
  replace?: boolean;
};

export default function SoftRedirect({
  href,
  fallback,
  replace = true,
}: Props) {
  const router = useRouter();

  useEffect(() => {
    startTransition(() => {
      replace ? router.replace(href) : router.push(href);
    });
  }, [href, replace, router]);

  return <>{fallback ?? null}</>;
}
