'use client';

import { ROLE_OPTIONS } from '@/utils/constants/interview.step';
import styles from './styles/sideOptionSelector.module.css';
import { useAtom } from 'jotai';
import { selectedRoleAtom } from '@/store/select';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';

interface Props {
  count: Record<string, number>;
  role: string;
}

const SidebarClient = ({ count, role }: Props) => {
  // const [selectedRole, setSelectedRole] = useAtom(selectedRoleAtom);
  const router = useRouter();

  return (
    <>
      <p className={styles.headerText}>분야별</p>
      <ul className={styles.optionContainer}>
        {ROLE_OPTIONS.map((option) => (
          <li
            key={option.value}
            className={`${role === option.value ? styles.selected : styles.option}`}
            onClick={() => {
              router.replace(`/step/select?role=${option.value}`);
            }}
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
