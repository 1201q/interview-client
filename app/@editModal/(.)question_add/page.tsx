import AddQuestionModal from '../_components/AddQuestionModal';
import Modal from '../_components/Modal';

const AddPageModal = () => {
  return (
    <Modal
      titleText="질문 추가"
      introduceText="추가하고 싶은 새로운 질문을 작성해주세요."
    >
      <AddQuestionModal />
    </Modal>
  );
};

export default AddPageModal;
