'use client';

import { useAtom } from 'jotai';
import Button from '../../../../../components/common/Button';
import styles from './styles/bottom.controller.module.css';
import { selectedQuestionsAtom } from '@/store/select';
import { useRouter } from 'next/navigation';

const BottomController = () => {
  const router = useRouter();
  const [selectedData, setSelectedData] = useAtom(selectedQuestionsAtom);

  const nextStep = selectedData.length < 5;
  const remainingCount = 5 - selectedData.length;

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        {selectedData.length === 0 ? (
          <p>질문을 선택하세요</p>
        ) : selectedData.length < 5 ? (
          <p>{selectedData.length}개 선택됨</p>
        ) : selectedData.length === 5 ? (
          <p>최대 15개까지 가능</p>
        ) : selectedData.length === 15 ? (
          <p>질문 최대 개수에 도달</p>
        ) : (
          <p>{selectedData.length}개 선택됨</p>
        )}
      </div>
      <div className={styles.buttonContainer}>
        <Button
          text="초기화"
          disabled={false}
          onClick={() => setSelectedData([])}
        />
        <Button
          text={nextStep ? `진행까지 ${remainingCount}개 남음` : '다음단계로'}
          disabled={nextStep}
          onClick={() => {
            router.push('/device_check');
          }}
          color="blue"
        />
      </div>
    </div>
  );
};

export default BottomController;
