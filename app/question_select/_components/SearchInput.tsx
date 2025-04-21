'use client';

import { useAtom } from 'jotai';
import styles from './styles/search.input.module.css';
import SearchIcon from '@/public/search.svg';
import { searchInputAtom } from '@/store/select';

const SearchInput = () => {
  const [inputValue, setInputValue] = useAtom(searchInputAtom);

  return (
    <div className={styles.container}>
      <SearchIcon className={styles.searchIcon} />
      <input
        type="text"
        placeholder="검색어를 입력해주세요"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
