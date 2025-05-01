import styles from './styles/page.header.module.css';
import Check from '@/public/check.svg';

interface Props {
  titleText: string;
  subtitleText: string;
}

const PageHeader = ({ titleText, subtitleText }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <p>{titleText}</p>
      </div>
      <div className={styles.subTitleContainer}>{subtitleText}</div>
    </div>
  );
};

export default PageHeader;
