import { cookies, headers } from 'next/headers';
import {
  ROLE_OPTIONS,
  USER_SIDEBAR_OPTIONS,
} from '@/utils/constants/interview.step';
import styles from './sidebar.module.css';
import Link from 'next/link';
import { getQuestionCounts } from '@/utils/services/question';

const SidebarServer = async () => {
  const cookieStore = await cookies();
  const header = await headers();
  const token = cookieStore.get('accessToken')?.value;

  const count = await getQuestionCounts();

  const role = header.get('x-role') || 'fe';
  const splitedPathname = header.get('x-pathname')?.split('/');

  const isUserPage = splitedPathname?.[3] === 'list';

  return (
    <>
      {/* page가 list가 아니라면 일반 질문들 */}
      <p className={styles.headerText}>분야별</p>
      <ul className={styles.optionContainer}>
        {ROLE_OPTIONS.map((option) => (
          <Link href={`/step/select?role=${option.value}`} key={option.value}>
            <li
              key={option.value}
              className={`${!isUserPage && role === option.value ? styles.selected : styles.option}`}
            >
              <p>{option.name}</p>
              <span>{count[option.value]}</span>
            </li>
          </Link>
        ))}
      </ul>

      {/* page가 list라면 유저에 관련된 질문 */}
      {/* token으로 비로그인에게는 메뉴 출력 x */}
      {token && (
        <>
          <p className={styles.headerText}>MY</p>
          <ul className={styles.optionContainer}>
            {USER_SIDEBAR_OPTIONS.map((option) => (
              <Link href={option.link} key={option.value}>
                <li
                  key={option.value}
                  className={`${isUserPage && splitedPathname[4] === option.value ? styles.selected : styles.option}`}
                >
                  <p>{option.name}</p>
                </li>
              </Link>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default SidebarServer;
