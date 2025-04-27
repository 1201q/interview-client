'use client';

import styles from './styles/top.alert.module.css';

interface Props {
  isCenter: boolean;
}

const TopAlert = ({ isCenter }: Props) => {
  const text = isCenter ? '시선이 가운데입니다.' : '카메라를 바라보세요.';

  return (
    <div className={`${styles.container} ${isCenter ? '' : styles.red}`}>
      <p>{text}</p>
    </div>
  );
};
export default TopAlert;
