'use client';

import Button from '@/app/question_select/_components/Button';
import styles from '../_styles/modal.module.css';

import Trash from '@/public/trash-solid.svg';

import { useRouter } from 'next/navigation';

import { UserQuestionType } from '@/utils/types/types';
import { useState } from 'react';
import { deleteUserQuestions } from '@/utils/actions/deleteUserQuestions';

interface Props {
  data: UserQuestionType[];
}

interface ItemProps {
  item: UserQuestionType;
  selected: boolean;
  onClick: (id: string) => void;
}

const DeleteQuestionModal = ({ data }: Props) => {
  const router = useRouter();
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const selected = (id: string) =>
    selectedItemIds.findIndex((data) => data === id) !== -1;

  const handleSubmit = async () => {
    try {
      await deleteUserQuestions(selectedItemIds);

      alert('질문 삭제 성공! 질문 목록에서 확인해보세요.');

      router.back();
    } catch (error) {
      alert('질문 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const onClick = (id: string) => {
    setSelectedItemIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <form action={handleSubmit} className={styles.contentsContainer}>
      <div className={styles.itemListContainer}>
        {data.map((item) => (
          <Item
            key={item.id}
            item={item}
            selected={selected(item.id)}
            onClick={onClick}
          />
        ))}
      </div>
      <div className={styles.bottomContainer}>
        <Button onClick={() => router.back()} text="취소" disabled={false} />
        <Button
          type="submit"
          text={`선택한 질문 삭제 ${selectedItemIds.length > 0 ? `(${selectedItemIds.length}개)` : ''}`}
          disabled={selectedItemIds.length < 1}
          color="red"
          icon={<Trash />}
        />
      </div>
    </form>
  );
};

const Item = ({ item, selected, onClick }: ItemProps) => {
  return (
    <div
      className={`${styles.itemContainer} ${selected ? styles.red : ''}`}
      onClick={() => onClick(item.id)}
    >
      <p>{item.question_text}</p>
    </div>
  );
};

export default DeleteQuestionModal;
