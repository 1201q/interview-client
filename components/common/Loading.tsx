import styles from './styles/loading.module.css';

interface Props {
  size: number;
  color: 'white' | 'blue' | 'gray' | 'black';
}

const Loading = ({ size, color }: Props) => {
  return (
    <div
      className={`${styles.container} `}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <div className={`${styles.spinner} ${styles[color]}`}></div>
    </div>
  );
};

export default Loading;
