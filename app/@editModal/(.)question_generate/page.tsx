import { getUserCreatedQuestions } from '@/utils/services/question';
import DeleteQuestionModal from '../_components/DeleteQuestionModal';
import Modal from '../_components/Modal';
import AiQuestionModal from '../_components/AiQuestionModal';

const AiPageModal = async () => {
  const data = await getUserCreatedQuestions();

  if (!data) {
    return null;
  }

  return (
    <Modal
      titleText="생성형 AI로 면접 질문 생성"
      introduceText="아래 정보를 입력하고 맞춤형 질문을 만들어보세요."
    >
      <AiQuestionModal />
    </Modal>
  );
};

export default AiPageModal;
