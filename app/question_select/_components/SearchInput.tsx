import styles from './styles/search.input.module.css';
import SearchIcon from '@/public/search.svg';

const SearchInput = () => {
  return (
    <div className={styles.container}>
      <SearchIcon className={styles.searchIcon} />
      <input type="text" placeholder="검색어를 입력해주세요" />
    </div>
  );
};

export default SearchInput;
