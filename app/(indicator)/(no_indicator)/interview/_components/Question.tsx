import styles from './styles/question.module.css';

interface Props {
  children?: React.ReactNode;
}
const Question = ({ children }: Props) => {
  return (
    <div className={styles.container}>
      <p>
        Intent를 통해 데이터 전달하는 과정에서 클래스 객체를 바로 전달할 수
        있나요? 전달하기 위해서는 어떤 처리가 필요한가요?
      </p>
      {children}
    </div>
  );
};

export default Question;
