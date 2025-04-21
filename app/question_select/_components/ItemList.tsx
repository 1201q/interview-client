'use client';

import { searchInputAtom } from '@/store/select';
import { useAtomValue } from 'jotai';
import QuestionItem from './QuestionItem';
import { BookmarkedQuestionType, QuestionType } from '@/utils/types/types';

interface Props {
  data: QuestionType[];
  bookmarkData: BookmarkedQuestionType[];
  emptyComponent?: React.ReactNode;
}

const ItemList = ({
  data,
  bookmarkData,
  emptyComponent = <div>데이터가 없습니다.</div>,
}: Props) => {
  const keyword = useAtomValue(searchInputAtom);
  const filteredData =
    keyword.length > 0
      ? data.filter((item) => item.question_text.includes(keyword))
      : data;

  if (filteredData.length === 0) {
    return emptyComponent;
  }

  return (
    <>
      {filteredData.map((item) => (
        <QuestionItem
          key={item.id}
          data={item}
          isBookmarked={
            bookmarkData.findIndex((data) => data.question_id === item.id) !==
            -1
          }
        />
      ))}
    </>
  );
};

export default ItemList;
