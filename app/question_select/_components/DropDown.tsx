import { DropDownMenuType, ExtendedRoleType } from '@/utils/types/types';
import styles from './styles/dropdown.module.css';
import Check from '@/public/check.svg';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface Props {
  menu: DropDownMenuType[];
  role: ExtendedRoleType;
  onClick: () => void;
  outsideClick: () => void;
  displayIcon?: boolean;
}

interface MenuProps {
  selected: boolean;
  text: string;
  href: string;
  onClick: () => void;
  displayIcon: boolean;
}

const DropDown = ({
  menu,
  role,
  onClick,
  outsideClick,
  displayIcon = true,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        outsideClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [outsideClick]);

  return (
    <div className={styles.container} ref={ref}>
      {menu.map((item) => (
        <Menu
          key={item.link}
          text={item.menu}
          selected={item.code === role}
          href={item.link}
          onClick={onClick}
          displayIcon={displayIcon}
        />
      ))}
    </div>
  );
};

const Menu = ({ selected, text, href, onClick, displayIcon }: MenuProps) => {
  return (
    <Link href={href} className={styles.menu} onClick={onClick}>
      {displayIcon && (
        <div className={styles.iconContainer}>{selected && <Check />}</div>
      )}
      <p>{text}</p>
    </Link>
  );
};

export default DropDown;
