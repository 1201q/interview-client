import PageHeader from '@/components/common/PageHeader';
import MicCheck from '../_components/MicCheck';
import MicCheckController from '../_components/MicCheckController';

const MicCheckPage = () => {
  return (
    <>
      <PageHeader
        titleText="마이크 체크"
        subtitleText="마이크가 목소리를 제대로 인식하는지 확인하는 단계에요. '안녕하세요' 라고 말해보세요."
      />
      <MicCheck />
      <MicCheckController />
    </>
  );
};

export default MicCheckPage;
