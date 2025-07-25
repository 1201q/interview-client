'use client';

import useCreateQuestion from './hooks/useCreateQuestion';

import InputPage from './InputPage';
import LoadingPage from './LoadingPage';

const TEST_ID = '4e88866e-2a7a-4e66-b49f-12a29e67109e';

const CreateQuestion = () => {
  const props = useCreateQuestion();

  // return <InputPage props={props} />;

  return <LoadingPage />;

  if (props.stage === 'input') {
    return <InputPage props={props} />;
  }
};

export default CreateQuestion;
