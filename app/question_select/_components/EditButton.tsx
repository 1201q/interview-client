'use client';

import Button from './Button';

import Plus from '@/public/plus.svg';

import { ExtendedRoleType } from '@/utils/types/types';
import { useState } from 'react';
import DropDown from './DropDown';
import { EDIT_DROPDOWN_MENU } from '@/utils/constants/interview.step';

interface Props {
  roleType: ExtendedRoleType;
}

const EditButton = ({ roleType }: Props) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          pointerEvents: isFilterOpen ? 'none' : 'auto',
        }}
      >
        <Button
          text={'질문 관리'}
          disabled={false}
          onClick={() => {
            setIsFilterOpen((prev) => !prev);
          }}
        />
      </div>
      {isFilterOpen && (
        <DropDown
          displayIcon={false}
          role={roleType}
          onClick={() => {
            setIsFilterOpen(false);
          }}
          outsideClick={() => {
            setIsFilterOpen(false);
          }}
          menu={EDIT_DROPDOWN_MENU}
        />
      )}
    </div>
  );
};

export default EditButton;
