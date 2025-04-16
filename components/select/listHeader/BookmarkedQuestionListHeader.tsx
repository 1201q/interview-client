import styles from './styles/questionListHeader.module.css';

import React from 'react';

const BookmarkedQuestionListHeader = () => {
  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <p>즐겨찾기한 질문</p>
      </div>
    </div>
  );
};

export default BookmarkedQuestionListHeader;
