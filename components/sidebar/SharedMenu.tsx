'use client';

import Link from 'next/link';
import styles from './styles/shared.menu.module.css';

import { FileTextIcon, PlayIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

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
      icon: (
        <PlayIcon
          size={20}
          style={{
            marginLeft: '-1px',
            marginRight: '0.4px',
            marginTop: '2px',
          }}
        />
      ),
    },
    {
      id: '2',
      text: '면접 기록',
      selected: false,
      href: '/projects',
      icon: (
        <FileTextIcon
          size={20}
          style={{ marginRight: '0px', marginTop: '3px' }}
        />
      ),
    },
  ];

  return (
    <nav className={styles.sharedMenu}>
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
    </nav>
  );
};

const MenuItem = ({ text, selected, href, icon }: MenuItemProps) => {
  const className = [styles.menu, selected ? styles.selected : '']
    .filter(Boolean)
    .join(' ');

  return (
    <Link href={href} className={className}>
      <div className={styles.menuTitle}>
        <span className={styles.menuIcon}>{icon}</span>
        <p className={styles.menuText}>{text}</p>
      </div>
    </Link>
  );
};

export default SharedMenu;
