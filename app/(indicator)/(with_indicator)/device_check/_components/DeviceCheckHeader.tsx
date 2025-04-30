import styles from './styles/header.module.css';

interface Props {
  text: string;
}

const DeviceCheckHeader = ({ text }: Props) => {
  return (
    <div className={styles.container}>
      <p className={styles.bigText}>{text}</p>
    </div>
  );
};

export default DeviceCheckHeader;
