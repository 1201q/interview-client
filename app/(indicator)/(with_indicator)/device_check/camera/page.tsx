import PageHeader from '@/components/common/PageHeader';

import CameraCheck from '../_components/CameraCheck';

import CameraCheckController from '../_components/CameraCheckController';

const CameraCheckPage = () => {
  return (
    <>
      <PageHeader
        titleText="카메라 체크"
        subtitleText="카메라가 얼굴을 제대로 인식하는지 확인하는 단계에요. 로딩이 완료되면 정면을 5초동안 바라보세요."
      />
      <CameraCheck />
      <CameraCheckController />
    </>
  );
};

export default CameraCheckPage;
