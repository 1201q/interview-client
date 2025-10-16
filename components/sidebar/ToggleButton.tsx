'use client';

import { useTransition } from 'react';

import styles from './styles/top.module.css';
import { setSidebarSize } from '@/utils/actions/sidebar';

import { PanelRightOpenIcon } from 'lucide-react';

export default function ToggleButton({
  toggleState,
}: {
  toggleState: 'mini' | 'expanded';
}) {
  const [pending, start] = useTransition();

  const onToggle = async () => {
    const html = document.documentElement;
    const cur = toggleState;
    const next = cur === 'mini' ? 'expanded' : 'mini';

    // 즉시 DOM 반영(낙관적)
    html.setAttribute('data-sidebar-size', next);
    html.style.setProperty('--sidebar-w', next === 'mini' ? '60px' : '280px');

    // 서버 쿠키 저장

    start(async () => await setSidebarSize(next));
  };

  return (
    <button
      className={styles.toggleButton}
      onClick={onToggle}
      disabled={pending}
    >
      <PanelRightOpenIcon
        size={20}
        strokeWidth={1.7}
        color="var(--neutral-6)"
      />
    </button>
  );
}
