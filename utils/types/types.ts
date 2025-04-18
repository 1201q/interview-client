import {
  ROLE_OPTIONS,
  USER_SIDEBAR_OPTIONS,
} from '../constants/interview.step';

export type RoleType = (typeof ROLE_OPTIONS)[number]['value'];
export type ExtendedRoleType = RoleType | 'user' | 'ai' | 'bookmark';

export type UserRoleType = (typeof USER_SIDEBAR_OPTIONS)[number]['value'];

export interface QuestionType {
  id: string;
  question_text: string;
  role: ExtendedRoleType;
  user_id: string | null;
  creator_type: 'user' | 'admin';
  created_at: string;
}

export interface UserQuestionType extends QuestionType {
  id: string;
  question_text: string;
  role: 'user';
  user_id: string;
  creator_type: 'user';
  created_at: string;
}

export interface AIQuestionType extends QuestionType {
  id: string;
  question_text: string;
  role: 'ai';
  user_id: string;
  creator_type: 'user';
  created_at: string;
}

export interface AddQuestionType {
  question_text: string;
  id: string;
}

export interface QuestionCountType {
  fe: number;
  be: number;
  android: number;
  ios: number;
}

export interface BookmarkedQuestionType {
  id: string;
  user_id: string;
  question_id: string;
  created_at: string;
  question: QuestionType;
}

export type HelpInformationType = 'ai-job' | 'ai-category' | 'ai-question';

export interface DropDownMenuType {
  menu: string;
  code: ExtendedRoleType;
  link: string;
  perm?: 'user';
}
