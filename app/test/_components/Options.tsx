'use client';

import { getRoleName } from '@/utils/formatter/question';
import Button from './Button';
import Filter from '@/public/filter.svg';
import { ExtendedRoleType } from '@/utils/types/types';
import { useEffect, useState } from 'react';
import DropDown from './DropDown';
import {
  DROPDOWN_MENU,
  LOGGEDIN_DROPDOWN_MENU,
} from '@/utils/constants/interview.step';

interface Props {
  roleType: ExtendedRoleType;
  isLoggedIn: boolean;
}

const Options = ({ roleType, isLoggedIn }: Props) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <div style={{ pointerEvents: isFilterOpen ? 'none' : 'auto' }}>
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
        <DropDown
          role={roleType}
          onClick={() => {
            setIsFilterOpen(false);
          }}
          outsideClick={() => {
            setIsFilterOpen(false);
          }}
          menu={
            isLoggedIn
              ? DROPDOWN_MENU.concat(LOGGEDIN_DROPDOWN_MENU)
              : DROPDOWN_MENU
          }
        />
      )}
    </>
  );
};

export default Options;
