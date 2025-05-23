'use client';

import { ReactNode } from 'react';
import InfoContainer from './InfoContainer';
import AnswerResult from './AnswerResult';
import { useAtomValue } from 'jotai';
import { selectedAnswerAtom } from '@/store/result';
import { dayjsFn } from '@/utils/libs/dayjs';

const AnswerResultContainer = () => {
  const selected = useAtomValue(selectedAnswerAtom);

  const wow = dayjsFn(
    dayjsFn(selected?.ended_at).diff(selected?.started_at),
  ).format('s');

  return (
    <>
      <InfoContainer
        headerTitle={`질문 ${selected && selected?.order + 1}`}
        subtitle={`소요시간: ${wow}초`}
      >
        <AnswerResult />
      </InfoContainer>
    </>
  );
};

export default AnswerResultContainer;
