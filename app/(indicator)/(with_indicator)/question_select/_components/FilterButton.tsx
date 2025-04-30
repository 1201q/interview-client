'use client';

import { getRoleName } from '@/utils/formatter/question';
import Button from '@/components/common/Button';
import Filter from '@/public/filter.svg';
import { ExtendedRoleType } from '@/utils/types/types';
import { useState } from 'react';

import {
  DROPDOWN_MENU,
  LOGGEDIN_DROPDOWN_MENU,
} from '@/utils/constants/interview.step';
import { useRouter } from 'next/navigation';
import DropDownMenu from '../../../../../components/common/DropDownMenu';

interface Props {
  roleType: ExtendedRoleType;
  isLoggedIn: boolean;
}

const FilterButton = ({ roleType, isLoggedIn }: Props) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();

  const concatMenu = isLoggedIn
    ? DROPDOWN_MENU.concat(LOGGEDIN_DROPDOWN_MENU)
    : DROPDOWN_MENU;

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          pointerEvents: isFilterOpen ? 'none' : 'auto',
        }}
      >
        <Button
          text={getRoleName(roleType)}
          disabled={false}
          icon={<Filter />}
          color="blue"
          onClick={() => {
            setIsFilterOpen((prev) => !prev);
          }}
        />
      </div>
      {isFilterOpen && (
        <DropDownMenu
          onClick={(selected) => {
            const href = concatMenu.find((menu) => menu === selected)?.link;

            if (href) {
              router.push(href);
            }

            setIsFilterOpen(false);
          }}
          outsideClick={() => {
            setIsFilterOpen(false);
          }}
          selectedMenu={concatMenu.find((menu) => menu.value === roleType)}
          menu={concatMenu.map((item) => item)}
        />
      )}
    </div>
  );
};

export default FilterButton;
