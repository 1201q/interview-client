import styles from './questionOptionModal.module.css';
import Modify from '@/public/pen.svg';
import Trash from '@/public/trash-solid.svg';
import PlusMark from '@/public/plus.svg';
import Link from 'next/link';
import { useSetAtom } from 'jotai';
import { userPageOptionModeAtom } from '@/store/select';

const UserCreatedQuestionOptionModal = () => {
  const setOptionMode = useSetAtom(userPageOptionModeAtom);

  return (
    <div className={styles.container}>
      <Link href={'/step/select/add'}>
        <button className={styles.option}>
          <span>질문 추가</span> <PlusMark />
        </button>
      </Link>

      <button
        className={styles.option}
        type="button"
        onClick={() => setOptionMode('delete')}
      >
        <span>질문 삭제</span>
        <Trash />
      </button>
    </div>
  );
};

export default UserCreatedQuestionOptionModal;
