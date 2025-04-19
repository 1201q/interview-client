import styles from './styles/side.info.module.css';
import Xmark from '@/public/xmark.svg';

const SelectQuestionList = () => {
  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <p className={styles.titleText}>선택한 질문</p>
      </div>
      <div className={styles.list}>
        <div className={styles.item}>
          <p>1. Webpack, Babel, Polyfill에 대해 설명해주세요.</p>
          <button>
            <Xmark />
          </button>
        </div>
        <div className={styles.item}>
          <p>2. Webpack, Babel, Polyfill에 대해 설명해주세요.</p>
          <button>
            <Xmark />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectQuestionList;
