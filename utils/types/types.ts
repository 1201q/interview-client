import {
  ROLE_OPTIONS,
  USER_SIDEBAR_OPTIONS,
} from '../constants/interview.step';

export type RoleType = (typeof ROLE_OPTIONS)[number]['value'];
export type UserRoleType = (typeof USER_SIDEBAR_OPTIONS)[number]['value'];

export interface QuestionType {
  id: string;
  question_text: string;
  role: RoleType;
}

export interface UserQuestionType {
  id: string;
  question_text: string;
  role: UserRoleType;
  user_id: string;
  created_at: string;
}

export interface UserCreatedQuestionType {
  id: string;
  question_text: string;
  role: 'user';
}
