import { Dayjs } from 'dayjs';
import { dayjsFn } from '../libs/dayjs';

export const getTimeAgo = (time: Dayjs) => {
  const now = dayjsFn();
  const diff = now.diff(time, 'minute');

  if (diff < 1) {
    return '방금 전';
  } else if (diff < 60) {
    return `${diff}분 전`;
  } else if (diff < 1440) {
    return `${Math.floor(diff / 60)}시간 전`;
  } else if (diff < 43200) {
    return `${Math.floor(diff / 1440)}일 전`;
  } else if (diff < 525600) {
    return `${Math.floor(diff / 43200)}개월 전`;
  } else if (diff < 63072000) {
    return `${Math.floor(diff / 525600)}년 전`;
  } else {
    return time.format('YYYY-MM-DD HH:mm:ss');
  }
};
