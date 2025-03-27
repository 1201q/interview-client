import Indicator from '@/components/indicator/Indicator';
import styles from './page.module.css';

interface Props {
  children: React.ReactNode;
}

const InterviewLayout = ({ children }: Props) => {
  return (
    <div className={styles.container}>
      <Indicator />
      {children}
    </div>
  );
};

export default InterviewLayout;
