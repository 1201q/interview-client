import styles from './styles/slideInfo.module.css';

interface Props {
  image: any;

  titleText: string;
  subtitleText: React.ReactNode;
}

const SlideInfo = ({ image, titleText, subtitleText }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>{image && image}</div>
      <p className={styles.titleText}>{titleText}</p>
      <div className={styles.subtitleTextContainer}>{subtitleText}</div>
    </div>
  );
};

export default SlideInfo;
