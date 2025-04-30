'use client';

import Modal from '../_components/Modal';
import AiQuestionModal from '../_components/AiQuestionModal';
import { useState } from 'react';
import AiQuestionResultModal from '../_components/AiQuestionResultModal';
import { GeneratedQuestionType } from '@/utils/types/types';

const AiPageModal = () => {
  const [stage, setStage] = useState<'generate' | 'result'>('generate');
  const [result, setResult] = useState<GeneratedQuestionType[]>([]);

  const setGenerateStage = () => {
    setStage('generate');
  };

  return (
    <Modal
      titleText={
        stage === 'generate' ? '생성형 AI로 면접 질문 생성' : '질문 생성 완료!'
      }
      introduceText={
        stage === 'generate'
          ? '아래 정보를 입력하고 맞춤형 질문을 만들어보세요.'
          : '마음에 드는 질문은 저장해보세요. 마음에 드는 질문이 없다면 다시 생성도 가능해요.'
      }
    >
      {stage === 'generate' ? (
        <AiQuestionModal setNextStage={setStage} setResult={setResult} />
      ) : (
        <AiQuestionResultModal
          setGenerateStage={setGenerateStage}
          result={result}
        />
      )}
    </Modal>
  );
};

export default AiPageModal;
