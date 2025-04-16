export const STEP = [
  {
    step: 1,
    name: '질문선택',
    page: 'select',
  },
  {
    step: 2,
    name: '환경체크',
    page: 'check',
  },
  { step: 3, name: '면접', page: 'interview' },
  { step: 4, name: '분석', page: 'analyze' },
];

export const ROLE_OPTIONS = [
  {
    name: '프론트엔드',
    value: 'fe',
  },
  {
    name: '백엔드',
    value: 'be',
  },
  {
    name: '안드로이드',
    value: 'android',
  },
  {
    name: 'IOS',
    value: 'ios',
  },
] as const;

export const USER_SIDEBAR_OPTIONS = [
  {
    name: '내가 추가한 질문',
    value: 'user',
    link: '/step/select/list/user',
  },
  {
    name: 'Ai가 생성한 질문',
    value: 'ai',
    link: '/step/select/list/ai',
  },
  {
    name: '즐겨찾기한 질문',
    value: 'bookmark',
    link: '/step/select/list/bookmark',
  },
] as const;
