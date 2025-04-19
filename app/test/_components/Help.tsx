import styles from './styles/side.info.module.css';

const Help = () => {
  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <div className={styles.questionMark}>?</div>
        <p className={styles.titleText}>도움말</p>
      </div>
      <p className={styles.text}>
        질문을 선택하면 리스트에 추가됩니다. 카테고리별로 필터링하거나 검색을
        통해 원하는 질문을 찾을 수 있습니다.
      </p>
    </div>
  );
};

export default Help;
