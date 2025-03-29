'use client';

import { ROLE_OPTIONS } from '@/utils/constants/interview.step';
import styles from './styles/sideOptionSelector.module.css';
import { useAtom } from 'jotai';
import { selectedRoleAtom } from '@/store/select';

interface Props {
  count: Record<string, number>;
}

const SidebarClient = ({ count }: Props) => {
  const [selectedRole, setSelectedRole] = useAtom(selectedRoleAtom);
  return (
    <>
      <p className={styles.headerText}>분야별</p>
      <ul className={styles.optionContainer}>
        {ROLE_OPTIONS.map((option) => (
          <li
            key={option.value}
            className={`${selectedRole.value === option.value ? styles.selected : styles.option}`}
            onClick={() => setSelectedRole(option)}
          >
            <p>{option.name}</p>
            <span>{count[option.value]}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SidebarClient;
