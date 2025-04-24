import styles from './styles/dropdown.module.css';
import Check from '@/public/check.svg';
import { useEffect, useRef } from 'react';

interface Props {
  menu: string[];
  selectedMenu?: string;
  onClick: (selectedMenu: string) => void;
  outsideClick: () => void;
  displayIcon?: boolean;
}

interface MenuProps {
  selected: boolean;
  text: string;
  onClick: (selectedMenu: string) => void;
  displayIcon: boolean;
}

const DropDownMenu = ({
  menu,
  selectedMenu,
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
      {menu.map((item, index) => (
        <Menu
          key={`${item}-${index}`}
          text={item}
          selected={item === selectedMenu}
          onClick={onClick}
          displayIcon={displayIcon}
        />
      ))}
    </div>
  );
};

const Menu = ({ selected, text, onClick, displayIcon }: MenuProps) => {
  return (
    <div
      className={styles.menu}
      onClick={() => {
        onClick(text);
      }}
    >
      {displayIcon && (
        <div className={styles.iconContainer}>{selected && <Check />}</div>
      )}
      <p>{text}</p>
    </div>
  );
};

export default DropDownMenu;
