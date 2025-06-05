import NewHeader from '@/components/header/NewHeader';
import styles from './page.module.css';
import Header from './components/Header';
import Container from './components/Container';

const Page = () => {
  return (
    <div className={styles.container}>
      <NewHeader />
      <div className={styles.contents}>
        <Header />
        <Container />
      </div>
    </div>
  );
};

export default Page;
