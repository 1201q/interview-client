import styles from './styles/draggable.question.item.module.css';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import Burger from '@/public/bars-solid.svg';

interface Props {
  text: string;

  id: string;
  index: number;
}

const DraggableQuestionItem = ({ text, id, index }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`${styles.container}`}
    >
      <div className={styles.itemTextContainer}>
        <p className={styles.indexText}>{index + 1}</p>
        <p>{text}</p>
      </div>
      <div className={styles.burgerButtonContainer}>
        <button {...listeners}>
          <Burger />
        </button>
      </div>
    </div>
  );
};

export default DraggableQuestionItem;
