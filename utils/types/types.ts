import { ROLE_OPTIONS } from '../constants/interview.step';

export type RoleType = (typeof ROLE_OPTIONS)[number]['value'];

export interface QuestionType {
  id: string;
  question_text: string;
  role: RoleType;
}
