'use client';

import styles from './styles/item.module.css';
import FillStar from '@/public/star-fill.svg';

import { addQuestionBookmark } from '@/utils/actions/addQuestionBookmark';
import { Dispatch } from 'react';
import { deleteQuestionBookmark } from '@/utils/actions/deleteQuestionBookmark';
import { hasAccessToken } from '@/utils/actions/hasAccessToken';
import { useRouter } from 'next/navigation';

interface Props {
  bookmark: boolean;
  setBookmark: Dispatch<React.SetStateAction<boolean>>;
  questionId: string;
}

const BookmarkButton = ({ bookmark, setBookmark, questionId }: Props) => {
  const router = useRouter();

  const handleClick = async () => {
    try {
      const isLoggedIn = await hasAccessToken();

      if (!isLoggedIn) {
        alert('로그인이 필요합니다.');
        router.push(`/login?prevPage=select`);
        return;
      }

      if (bookmark) {
        await deleteQuestionBookmark(questionId);
      } else {
        await addQuestionBookmark(questionId);
      }

      setBookmark((prev) => !prev);
    } catch (error) {
      console.error('북마크 업데이트 실패', error);
      alert('북마크 업데이트 실패');
    }
  };

  return (
    <button className={styles.bookMarkButton} onClick={handleClick}>
      <FillStar
        className={`${bookmark ? styles.fillStarSvg : styles.voidStarSvg}`}
      />
    </button>
  );
};

export default BookmarkButton;
