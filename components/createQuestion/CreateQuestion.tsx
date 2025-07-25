'use client';

import useCreateQuestion from './hooks/useCreateQuestion';

import InputComponent from './InputComponent';
import LoadingComponent from './LoadingComponent';

const TEST_ID = '4e88866e-2a7a-4e66-b49f-12a29e67109e';

const CreateQuestion = () => {
  const props = useCreateQuestion();

  // return <InputComponent props={props} />;

  return <LoadingComponent />;

  if (props.stage === 'input') {
    return <InputComponent props={props} />;
  }
};

export default CreateQuestion;
