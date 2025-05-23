import { ReactNode } from 'react';
import styles from './styles/answer.result.module.css';
import { useAtomValue } from 'jotai';
import { selectedAnswerAtom } from '@/store/result';
import Button from '@/components/common/Button';
import Play from '@/public/play.svg';

const AnswerResult = () => {
  const selected = useAtomValue(selectedAnswerAtom);

  return (
    <div className={styles.container}>
      <div className={styles.questionContainer}>
        <p>질문</p>
        <span>{selected?.question.question_text}</span>
      </div>
      <div className={styles.questionContainer}>
        <p>내 답변</p>
        <div className={styles.answerContainer}>
          저의 강점은 문제 해결 능력과 팀워크입니다. 어려운 문제가 생겼을 때
          다양한 각도에서 접근하여 해결책을 찾는 것을 좋아합니다. 또한 팀 내에서
          원활한 소통을 통해 협업하는 것에 능숙합니다. 약점으로는 때로는
          완벽주의적 성향으로 인해 작은 세부사항에 너무 많은 시간을 투자할 수
          있다는 점입니다. 이를 개선하기 위해 시간 관리 기술을 꾸준히 연습하고
          있습니다.
        </div>
      </div>
      <div>
        <Button text="답변 다시 듣기" icon={<Play />} disabled={false} />
      </div>
    </div>
  );
};

export default AnswerResult;
