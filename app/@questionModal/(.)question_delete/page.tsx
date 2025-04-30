import {
  getAiGeneratedQuestions,
  getUserCreatedQuestions,
} from '@/utils/services/question';
import DeleteQuestionModal from '../_components/DeleteQuestionModal';
import Modal from '../_components/Modal';

const DeletePageModal = async () => {
  const userData = await getUserCreatedQuestions();
  const aiData = await getAiGeneratedQuestions();

  const data = userData.concat(aiData);

  if (!data) {
    return null;
  }

  return (
    <Modal
      titleText="질문 삭제"
      introduceText="삭제할 질문을 선택하세요. 삭제된 질문은 복구할 수 없습니다."
    >
      <DeleteQuestionModal data={data} />
    </Modal>
  );
};

export default DeletePageModal;
