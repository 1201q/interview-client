import styles from './styles/header.module.css';

const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <p>맞춤형 면접 질문 생성</p>
        <span>
          이력서와 지원하려는 회사의 채용공고를 입력하면 AI가 맞춤형 면접 질문을
          생성해드립니다.
        </span>
      </div>
    </div>
  );
};

export default Header;
