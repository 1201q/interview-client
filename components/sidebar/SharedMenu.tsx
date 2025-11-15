'use client';

import Link from 'next/link';
import styles from './styles/shared.menu.module.css';

import { PlayIcon, FolderClosedIcon, HistoryIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';

interface MenuItemProps {
  id: string;
  text: string;
  selected: boolean;
  href: string;
  icon: any;
}

const SharedMenu = () => {
  const pathname = usePathname();

  const menu: MenuItemProps[] = [
    {
      id: '1',
      text: '새로운 면접 시작',
      selected: pathname.startsWith('/new-request'),
      href: '/new-request',
      icon: <PlayIcon size={20} />,
    },
    {
      id: '2',
      text: '면접 기록',
      selected: pathname.startsWith('/history/interview'),
      href: '/history/interview',
      icon: <HistoryIcon size={19} style={{ marginLeft: '2px' }} />,
    },
    {
      id: '3',
      text: 'My',
      selected: pathname.startsWith('/history/request'),
      href: '/history/request',
      icon: <FolderClosedIcon size={18} style={{ marginLeft: '2px' }} />,
    },
  ];

  return (
    <nav className={styles.sharedMenu}>
      <LayoutGroup id="sidebar">
        <ol className={styles.list}>
          {menu.map((s) => (
            <li key={s.id}>
              <MenuItem
                id={s.id}
                text={s.text}
                selected={s.selected}
                href={s.href}
                icon={s.icon}
              />
            </li>
          ))}
        </ol>
      </LayoutGroup>
    </nav>
  );
};

const MenuItem = ({ text, selected, href, icon }: MenuItemProps) => {
  const className = [styles.menu, selected ? styles.selected : '']
    .filter(Boolean)
    .join(' ');

  return (
    <Link href={href} className={className}>
      <AnimatePresence mode="sync">
        {selected && (
          <motion.span
            layoutId="shared-sidebar-row-highlight"
            layout="position"
            className={styles.highlightBg}
            transition={{ ease: [0.22, 0.61, 0.36, 1], duration: 0.3 }}
          />
        )}
      </AnimatePresence>
      <span className={styles.menuIcon}>{icon}</span>
      <p className={styles.menuText}>{text}</p>
    </Link>
  );
};

export default SharedMenu;
