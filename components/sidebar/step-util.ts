export type StepKey = 'resume' | 'job' | 'generating' | 'select';

export const stepOrder: StepKey[] = ['resume', 'job', 'generating', 'select'];

export function getStepFromPathname(pathname: string): StepKey | null {
  if (pathname.includes('/resume')) return 'resume';
  if (pathname.includes('/job')) return 'job';
  if (pathname.includes('/generating')) return 'generating';
  if (pathname.includes('/select')) return 'select';
  return null;
}
