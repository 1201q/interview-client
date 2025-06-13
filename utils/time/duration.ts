import { QuestionSection } from '../types/types';

export const getInterviewSecBySection = (section: QuestionSection): number => {
  switch (section) {
    case 'basic':
      return 60;
    case 'experience':
      return 120;
    case 'expertise':
      return 90;
    case 'job_related':
      return 90;
    default:
      return 60;
  }
};
