import styles from './styles/user-input.module.css';

interface UserInputProps {
  titleText: string;
  subText: string;
  icon: React.JSX.Element;
  children: React.ReactNode;
}

const UserInput = ({ titleText, subText, icon, children }: UserInputProps) => {
  return (
    <div className={styles.userInfoContainer}>
      <div className={styles.titleContainer}>
        <div className={styles.logoContainer}>{icon}</div>
        <div className={styles.titleTextContainer}>
          <p>{titleText}</p>
          <span>{subText}</span>
        </div>
      </div>
      <div className={styles.inputContainer}>{children}</div>
    </div>
  );
};

export default UserInput;
