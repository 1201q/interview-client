export type MenuType = { name: string; value: string; link?: string };

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

// 분석결과 타입

export interface EvaluationType {
  [key: string]: string;
}

export interface QuestionEvaluation {
  question_id: string;
  question_text: string;
  intent: string;
  core_criteria: EvaluationType;
  supplementary_criteria: EvaluationType;
  expected_keywords: string[];
}

// whisper
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

// return words
export interface Words {
  before: string;
  after: string;
  start: number;
  end: number;
}

// 반환 타입

export interface Feedback {
  feedback: string;
  good: string[];
  bad: string[];
  grade: string;
}

export interface AnalysisResult {
  words: Words[];
  transcript: WhisperSttType;
  feedback: Feedback;
}

export interface AnalysisProgress {
  total: number;
  done: number;
  percent: number;
  status: 'pending' | 'loading' | 'done';
}

// 질문 생성후 결과 타입

export type QuestionSection =
  | 'basic'
  | 'experience'
  | 'job_related'
  | 'expertise';

export interface GeneratedQuestionItem {
  id: string;
  question: string;
  based_on: string;
  section: QuestionSection;
}

export interface QuestionDataArray {
  id: string;
  question: string;
  based_on: string;
  section: QuestionSection;
}
