'use client';

import useCreateQuestion from './hooks/useCreateQuestion';

import InputPage from './InputPage';
import LoadingPage from './LoadingPage';
import SelectPage from './SelectPage';

const TEST_ID = '4e88866e-2a7a-4e66-b49f-12a29e67109e';

const CreateQuestion = () => {
  const props = useCreateQuestion();

  if (props.stage === 'loading') {
    return <LoadingPage onLoadingComplete={props.onLoadingComplete} />;
  } else if (props.stage === 'result') {
    return <SelectPage />;
  } else {
    return <div>1</div>;
  }

  // return <InputPage props={props} />;

  if (props.stage === 'result') {
    return <SelectPage />;
  }

  if (props.stage === 'input') {
    return <InputPage props={props} />;
  }
};

export default CreateQuestion;
