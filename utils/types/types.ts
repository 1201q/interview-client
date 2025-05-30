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
  code: string;
  link: string;
  perm?: 'user';
}

export type MenuType = { name: string; value: string; link?: string };
export type GeneratedQuestionType = { question_text: string; id: number };

export type DirectionType = 'up' | 'down' | 'right' | 'left' | 'center';

export type InterviewClientStatusType =
  | 'pending'
  | 'countdown'
  | 'answering'
  | 'submitting'
  | 'waiting30'
  | 'end';

export type InterviewSessionStatusType =
  | 'pending'
  | 'ready'
  | 'in_progress'
  | 'completed'
  | 'expired';

export type InterviewSessionQuestionStatusType =
  | 'waiting'
  | 'ready'
  | 'answering'
  | 'submitted';

export type InterviewSessionQuestionAnalysisStatusType =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';

export type InterviewSessionType = {
  id: string;
  user_id: string;
  status: InterviewSessionStatusType;
  created_at: string;
  updated_at: string;
  questions: InterviewSessionQuestionType[];
  evaluation_standard: any;
};

export type InterviewSessionQuestionType = {
  id: string;
  order: number;
  started_at: null | string;
  ended_at: null | string;
  created_at: string;
  question: QuestionType;
  status: InterviewSessionQuestionStatusType;
  analysis_status: InterviewSessionQuestionAnalysisStatusType;
  analysis_result: any;
};

// whisper api 타입

export interface SegmentsType {
  avg_logprob: number;
  compression_ratio: number;
  end: number;
  id: number;
  no_speech_prob: number;
  seek: number;
  start: number;
  temperature: number;
  text: string;
  tokens: string[];
}

export interface WordsType {
  word: string;
  start: number;
  end: number;
}

export interface WhisperSttType {
  duration: number;
  language: string;
  task: string;
  text: string;
  segments: SegmentsType[];
  words: WordsType[];
}
