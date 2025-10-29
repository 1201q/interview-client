import { QuestionSection } from './types';

export type GenerateEvent =
  | {
      type: 'question';
      text: string;
      based_on: string;
      section: QuestionSection;
    }
  | {
      type: 'progress';
      limitCount: number;
      createdTotal: number;
    }
  | { type: 'completed'; msg?: string }
  | { type: 'failed'; msg?: string; reason?: string };
