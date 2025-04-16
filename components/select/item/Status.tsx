import styles from './styles/status.module.css';

interface Props {
  text: string;
  type?: 'blue' | 'red' | 'gray';
}

const Status = ({ text, type = 'gray' }: Props) => {
  return (
    <div className={`${styles.status} ${styles[type]}`}>
      <p>{text}</p>
    </div>
  );
};

export default Status;
