'use client';

import Button from '@/app/question_select/_components/Button';
import styles from '../_styles/modal.module.css';

import { useRouter } from 'next/navigation';

import AngleLeft from '@/public/angle-left.svg';
import { Dispatch, SetStateAction, useState } from 'react';

import { AI_DROPDOWN_MENU } from '@/utils/constants/interview.step';
import DropDownMenu from '@/app/question_select/_components/DropDownMenu';
import { GeneratedQuestionType, MenuType } from '@/utils/types/types';
import { generateQuestions } from '@/utils/actions/generateQuestions';

interface Props {
  setNextStage: Dispatch<SetStateAction<'generate' | 'result'>>;
  setResult: Dispatch<SetStateAction<GeneratedQuestionType[]>>;
}

const AiQuestionModal = ({ setNextStage, setResult }: Props) => {
  const router = useRouter();

  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<null | MenuType>(null);

  const [isMenuUnselected, setIsMenuUnselected] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    if (!selectedOption) {
      setIsMenuUnselected(true);
      return;
    }

    try {
      const res = await generateQuestions(formData, selectedOption.value);

      if (res.success) {
        setResult(res.questions);
        setNextStage('result');
      } else {
        alert('질문 생성에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      alert('질문 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <form action={handleSubmit} className={styles.contentsContainer}>
      <div className={styles.rowGap}>
        <p className={styles.sectionText}>직무 분야</p>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="예: 데이터 분석, 백엔드, 안드로이드 앱 개발"
            name="jobRole"
            required
            minLength={5}
          />
        </div>
        <p className={styles.sectionText}>질문 유형</p>
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className={styles.dropdownContainer}
            style={{
              pointerEvents: isOptionOpen ? 'none' : 'auto',
            }}
            onClick={() => {
              setIsOptionOpen(true);
            }}
          >
            <p>
              {selectedOption ? selectedOption.name : '질문 유형을 선택하세요'}
            </p>
            <AngleLeft />
          </button>
          {isOptionOpen && (
            <DropDownMenu
              menu={AI_DROPDOWN_MENU}
              onClick={(option) => {
                setSelectedOption(option);
                setIsOptionOpen(false);
              }}
              outsideClick={() => {
                setIsOptionOpen(false);
              }}
              displayIcon={false}
            />
          )}
          {isMenuUnselected && (
            <div className={styles.errorContainer}>질문 유형을 선택하세요</div>
          )}
        </div>

        <p className={styles.sectionText}>질문 주제</p>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="예: 쿠버네티스, NextJS, 네트워크 개념, Flask..."
            name="topic"
            required
            minLength={5}
          />
        </div>
        <div className={styles.bottomContainer}>
          <Button onClick={() => router.back()} text="취소" disabled={false} />
          <Button
            type="submit"
            text="질문 생성하기"
            disabled={false}
            color="blue"
          />
        </div>
      </div>
    </form>
  );
};

export default AiQuestionModal;
