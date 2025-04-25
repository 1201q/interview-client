import styles from './styles/dropdown.module.css';
import Check from '@/public/check.svg';
import { MenuType } from '@/utils/types/types';
import { useEffect, useRef } from 'react';

interface Props {
  menu: MenuType[];
  selectedMenu?: MenuType;
  onClick: (selectedMenu: MenuType) => void;
  outsideClick: () => void;
  displayIcon?: boolean;
}

interface MenuProps {
  selected: boolean;
  data: MenuType;
  onClick: (selectedMenu: MenuType) => void;
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
      {menu.map((item) => (
        <Menu
          key={item.value}
          data={item}
          selected={item === selectedMenu}
          onClick={onClick}
          displayIcon={displayIcon}
        />
      ))}
    </div>
  );
};

const Menu = ({ selected, data, onClick, displayIcon }: MenuProps) => {
  return (
    <div
      className={styles.menu}
      onClick={() => {
        onClick(data);
      }}
    >
      {displayIcon && (
        <div className={styles.iconContainer}>{selected && <Check />}</div>
      )}
      <p>{data.name}</p>
    </div>
  );
};

export default DropDownMenu;
