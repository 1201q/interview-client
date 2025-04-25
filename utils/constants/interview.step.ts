import { DropDownMenuType, MenuType } from '../types/types';

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

export const DROPDOWN_MENU: MenuType[] = [
  { name: '프론트엔드', value: 'fe', link: '/question_select?role=fe' },
  { name: '백엔드', value: 'be', link: '/question_select?role=be' },
  {
    name: '안드로이드',
    value: 'android',

    link: '/question_select?role=android',
  },
  { name: 'IOS', value: 'ios', link: '/question_select?role=ios' },
];

export const LOGGEDIN_DROPDOWN_MENU: MenuType[] = [
  {
    name: '내가 생성한 질문',
    value: 'user',

    link: '/question_select?role=user',
  },
  {
    name: 'AI가 생성한 질문',
    value: 'ai',

    link: '/question_select?role=ai',
  },
  {
    name: '즐겨찾기한 질문',
    value: 'bookmark',
    link: '/question_select?role=bookmark',
  },
];

export const EDIT_DROPDOWN_MENU: MenuType[] = [
  { name: '질문 추가', value: 'add', link: '/question_add' },
  { name: '질문 삭제', value: 'delete', link: '/question_delete' },
];

export const AI_DROPDOWN_MENU: MenuType[] = [
  { name: '개념 설명형', value: 'concept' },
  { name: '비교 설명형', value: 'comparison' },
  { name: '시스템 설계형', value: 'system_design' },
  { name: '구현 문제형', value: 'implementation' },
  { name: '경험/상황형', value: 'experience' },
];
