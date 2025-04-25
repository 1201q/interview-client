'use client';

import Button from './Button';
import { useState } from 'react';
import { EDIT_DROPDOWN_MENU } from '@/utils/constants/interview.step';
import DropDownMenu from './DropDownMenu';
import { useRouter } from 'next/navigation';

const EditButton = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();

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
        <DropDownMenu
          displayIcon={false}
          onClick={(selected) => {
            const href = EDIT_DROPDOWN_MENU.find(
              (menu) => menu === selected,
            )?.link;

            if (href) {
              router.push(href);
            }
            setIsFilterOpen(false);
          }}
          outsideClick={() => {
            setIsFilterOpen(false);
          }}
          menu={EDIT_DROPDOWN_MENU.map((menu) => menu)}
        />
      )}
    </div>
  );
};

export default EditButton;
