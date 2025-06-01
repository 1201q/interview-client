'use client';

import InfoContainer from './InfoContainer';
import AnswerResult from './AnswerResult';

import { dayjsFn } from '@/utils/libs/dayjs';
import {
  InterviewSessionQuestionType,
  InterviewSessionType,
} from '@/utils/types/types';

const AnswerResultContainer = ({
  data,
}: {
  data: InterviewSessionQuestionType;
}) => {
  const wow = dayjsFn(dayjsFn(data?.ended_at).diff(data?.started_at)).format(
    's',
  );

  return (
    <>
      <InfoContainer
        headerTitle={`질문 ${data.order + 1}`}
        subtitle={`소요시간: ${wow}초`}
      >
        <AnswerResult selected={data} />
      </InfoContainer>
    </>
  );
};

export default AnswerResultContainer;
