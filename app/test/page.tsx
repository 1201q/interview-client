import BottomController from './_components/BottomController';
import Button from './_components/Button';
import Indicator from './_components/Indicator';
import QuestionItem from './_components/QuestionItem';
import SearchInput from './_components/SearchInput';
import styles from './page.module.css';
import Filter from '@/public/filter.svg';

const Page = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contentsContainer}>
        <Indicator />
        <div className={styles.listHeaderContainer}>
          <SearchInput />
          <div className={styles.optionContainer}>
            <Button text="카테고리" disabled={false} icon={<Filter />} />
          </div>
        </div>
        <div className={styles.listContainer}>
          <QuestionItem /> <QuestionItem /> <QuestionItem />
        </div>
      </div>
      <div className={styles.bottomContainer}>
        <BottomController />
      </div>
    </div>
  );
};

export default Page;
