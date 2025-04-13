import styles from './questionOptionModal.module.css';
import Trash from '@/public/trash-solid.svg';
import PlusMark from '@/public/plus.svg';
import Link from 'next/link';

const UserCreatedQuestionOptionModal = () => {
  return (
    <div className={styles.container}>
      <Link href={'/step/select/add'}>
        <button className={styles.option}>
          <span>질문 추가</span> <PlusMark />
        </button>
      </Link>

      <Link href={'/step/select/delete'}>
        <button className={styles.option} type="button">
          <span>질문 삭제</span>
          <Trash />
        </button>
      </Link>
    </div>
  );
};

export default UserCreatedQuestionOptionModal;
