import styles from './styles/info.module.css';

interface Props {
  children: React.ReactNode;
}

const Info = ({ children }: Props) => {
  return <div className={`${styles.container}`}>{children}</div>;
};

export default Info;
