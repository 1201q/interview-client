'use client';

import { useAtom } from 'jotai';
import Button from './Button';
import styles from './styles/bottom.controller.module.css';
import { selectedQuestionsAtom } from '@/store/select';

const BottomController = () => {
  const [selectedData, setSelectedData] = useAtom(selectedQuestionsAtom);

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        {selectedData.length === 0 ? (
          <p>질문을 선택하세요</p>
        ) : (
          <p>{selectedData.length}개 선택됨</p>
        )}
      </div>
      <div className={styles.buttonContainer}>
        <Button
          text="선택 초기화"
          disabled={false}
          onClick={() => setSelectedData([])}
        />
        <Button text="다음 단계로" disabled={true} color="blue" />
      </div>
    </div>
  );
};

export default BottomController;
