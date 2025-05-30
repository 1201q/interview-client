'use client';

import { useAtom } from 'jotai';
import Button from '@/components/common/Button';
import { selectedQuestionsAtom } from '@/store/select';
import { useRouter } from 'next/navigation';
import BottomController from '@/components/common/BottomController';

const NEXT_COUNT = 1;
const MAX_COUNT = 15;

const QuestionSelectController = () => {
  const router = useRouter();
  const [selectedData, setSelectedData] = useAtom(selectedQuestionsAtom);

  const nextStep = selectedData.length < NEXT_COUNT;
  const remainingCount = NEXT_COUNT - selectedData.length;

  const message = (() => {
    if (selectedData.length === 0) return '질문을 선택하세요';
    if (selectedData.length < NEXT_COUNT)
      return `${selectedData.length}개 선택됨`;
    if (selectedData.length === NEXT_COUNT) return '최대 15개까지 가능';
    if (selectedData.length === MAX_COUNT) return '질문 최대 개수에 도달';
    return `${selectedData.length}개 선택됨`;
  })();

  return (
    <BottomController
      leftContent={<p>{message}</p>}
      rightContent={
        <>
          <Button
            text="초기화"
            disabled={false}
            onClick={() => setSelectedData([])}
          />
          <Button
            text={nextStep ? `진행까지 ${remainingCount}개 남음` : '다음단계로'}
            disabled={nextStep}
            onClick={() => router.push('/question_select/confirm')}
            color="blue"
          />
        </>
      }
    />
  );
};

export default QuestionSelectController;
