import styles from './styles/analyze-weakstring.module.css';
import { motion } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  CircleAlertIcon,
} from 'lucide-react';

interface WeakStrongProps {
  type: 'weak' | 'strong';
}

const AnalyzeWeakStrong = ({ type }: WeakStrongProps) => {
  const mock = [
    '명확하고 논리적인 답변 구조',
    '구체적인 경험 사례 제시',
    '자신감 있는 말투와 태도',
  ];

  return (
    <div className={styles.weakStrongContainer}>
      <div className={styles.titleContainer}>
        <div
          className={`${styles.titleIcon} ${type === 'weak' ? styles.yellow : styles.mint}`}
        >
          {type === 'strong' && (
            <TrendingUp size={20} color="var(--main-green-color)" />
          )}
          {type === 'weak' && (
            <TrendingDown size={20} color="var(--font-yellow-color)" />
          )}
        </div>
        <p>{type === 'weak' ? '개선할 점' : '강점'}</p>
      </div>
      <div className={styles.itemListContainer}>
        {mock.map((text, i) => (
          <div key={`${type}-${i}`} className={styles.item}>
            {type === 'strong' && (
              <CheckCircle2 size={20} color="var(--main-green-color)" />
            )}
            {type === 'weak' && (
              <CircleAlertIcon size={20} color="var(--font-yellow-color)" />
            )}
            <p>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyzeWeakStrong;
