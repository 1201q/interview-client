import { headers } from 'next/headers';
import { ROLE_OPTIONS } from '@/utils/constants/interview.step';
import styles from './styles/sideOptionSelector.module.css';
import Link from 'next/link';

const SidebarServer = async () => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question/count`);
  const count: Record<string, number> = await data.json();
  const header = await headers();
  const role = header.get('x-role') || 'fe';

  return (
    <>
      <p className={styles.headerText}>분야별</p>
      <ul className={styles.optionContainer}>
        {ROLE_OPTIONS.map((option) => (
          <Link href={`/step/select?role=${option.value}`} key={option.value}>
            <li
              key={option.value}
              className={`${role === option.value ? styles.selected : styles.option}`}
            >
              <p>{option.name}</p>
              <span>{count[option.value]}</span>
            </li>
          </Link>
        ))}
      </ul>
    </>
  );
};

export default SidebarServer;
