import styles from './styles/step.module.css';

interface Props {
  name: string;
  current: boolean;
  index: number;
  flex?: number;
}

const Step = ({ name, current, index, flex }: Props) => {
  return (
    <div
      style={{ flex: flex !== undefined ? flex : 1 }}
      className={`${styles.container} ${current ? styles.current : ''}`}
    >
      <span>step {index}</span>
      <p>{name}</p>
    </div>
  );
};

export default Step;
