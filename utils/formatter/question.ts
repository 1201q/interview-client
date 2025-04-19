import { ExtendedRoleType } from '../types/types';

export const getRoleName = (role: ExtendedRoleType) => {
  if (role === 'fe') return '프론트엔드';
  else if (role === 'be') return '백엔드';
  else if (role === 'android') return '안드로이드';
  else if (role === 'ios') return 'IOS';
  else if (role === 'ai') return 'AI가 생성한 질문';
  else if (role === 'bookmark') return '즐겨찾기한 질문';
  else return '내가 생성한 질문';
};
