import { ROLE_OPTIONS } from '../constants/interview.step';

type RoleType = (typeof ROLE_OPTIONS)[number]['value'];

export interface QuestionType {
  id: string;
  question_text: string;
  role: RoleType;
}
