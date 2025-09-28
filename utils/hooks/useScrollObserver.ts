'use client';

import { useEffect, useState } from 'react';

type Options = {
  ids: string[];

  offset?: number;
};

export const useScrollObserver = ({ ids, offset = 0 }: Options) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top),
          );

        if (visible[0]) setActiveId((visible[0].target as HTMLElement).id);
      },
      {
        root: null,
        rootMargin: `-${offset}px 0px -50% 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    els.forEach((el) => {
      console.log('observe', el.id);
      observer.observe(el);
    });
    return () => {
      console.log('cleanup useScrollObserver');
      observer.disconnect();
    };
  }, [ids, offset]);

  return activeId;
};
