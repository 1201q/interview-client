'use client';

import Button from '@/components/common/Button';
import styles from '../_styles/modal.module.css';

import { useRouter } from 'next/navigation';
import { createUserQuestion } from '@/utils/actions/createUserQuestion';

const AddQuestionModal = () => {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    try {
      await createUserQuestion(formData);

      alert('질문 추가 성공! 질문 목록에서 확인해보세요.');

      router.back();
    } catch (error) {
      alert('질문 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <form action={handleSubmit} className={styles.contentsContainer}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="질문을 입력하세요"
          name="question"
          required
          minLength={10}
        />
      </div>

      <div className={styles.bottomContainer}>
        <Button onClick={() => router.back()} text="취소" disabled={false} />
        <Button type="submit" text="저장" disabled={false} color="blue" />
      </div>
    </form>
  );
};

export default AddQuestionModal;
