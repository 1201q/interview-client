'use client';

import Button from '@/components/common/Button';
import styles from '../_styles/modal.module.css';

import { useRouter } from 'next/navigation';

import { useState } from 'react';

import { GeneratedQuestionType } from '@/utils/types/types';
import { createAiQuestions } from '@/utils/actions/createAiQuestions';

interface Props {
  result: GeneratedQuestionType[];
  setGenerateStage: () => void;
}

interface ItemProps {
  item: GeneratedQuestionType;
  selected: boolean;
  onClick: (id: number) => void;
}

const AiQuestionResultModal = ({ result, setGenerateStage }: Props) => {
  const router = useRouter();

  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  const selected = (id: number) =>
    selectedItemIds.findIndex((data) => data === id) !== -1;

  const handleSubmit = async () => {
    const selected = result
      .filter((q) => selectedItemIds.includes(q.id))
      .map((question) => question.question_text);

    console.log(selected);

    try {
      await createAiQuestions(selected);

      alert('질문 추가 성공! 질문 목록에서 확인해보세요.');

      router.back();
    } catch (error) {
      alert('질문 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const onClick = (id: number) => {
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
        {result.map((item) => (
          <Item
            key={item.id}
            item={item}
            selected={selected(item.id)}
            onClick={onClick}
          />
        ))}
      </div>
      <div className={styles.bottomContainer}>
        <Button
          onClick={() => setGenerateStage()}
          text="다시 생성하기"
          disabled={false}
        />
        <Button
          type="submit"
          text={`선택한 질문 저장 ${selectedItemIds.length > 0 ? `(${selectedItemIds.length}개)` : ''}`}
          disabled={selectedItemIds.length < 1}
          color="blue"
        />
      </div>
    </form>
  );
};

const Item = ({ item, selected, onClick }: ItemProps) => {
  return (
    <div
      className={`${styles.wrappedItemContainer} ${selected ? styles.blue : ''}`}
      onClick={() => onClick(item.id)}
    >
      <p>{item.question_text}</p>
    </div>
  );
};

export default AiQuestionResultModal;
