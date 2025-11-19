'use client';

import styles from './styles/top.module.css';
import { PanelRightOpenIcon } from 'lucide-react';

export default function ToggleButton() {
  const onToggle = async () => {
    const html = document.documentElement;
    const cur =
      html.getAttribute('data-sidebar-size') === 'mini' ? 'mini' : 'expanded';
    const next = cur === 'mini' ? 'expanded' : 'mini';

    // 즉시 DOM 반영(낙관적)
    html.setAttribute('data-sidebar-size', next);
    html.style.setProperty('--sidebar-w', next === 'mini' ? '60px' : '280px');

    try {
      localStorage.setItem('sidebar-size', next);
    } catch {
      // do nothing
    }
  };

  return (
    <button className={styles.toggleButton} onClick={onToggle}>
      <PanelRightOpenIcon
        size={20}
        strokeWidth={1.7}
        color="var(--neutral-5)"
      />
    </button>
  );
}
