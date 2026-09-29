export type Section = 'overview' | 'wissen' | 'videos' | 'simulator';
export const sectionsOrder: Section[] = ['overview', 'wissen', 'videos', 'simulator'];

export interface GameState {
  consentMissing?: boolean;
  time?: number; // In minutes, starts at 0 (e.g. 06:30)
  nervousness?: number; // 0 to 100
  [key: string]: any;
}

export interface Option {
  label: string;
  scoreChange: number;
  feedbackTitle: string;
  feedbackText: string;
  correct: boolean;
  stateEffects?: Partial<GameState>;
  timeCost?: number;
  nervousnessChange?: number;
  isFatal?: boolean;
}

export interface Scenario {
  id: number;
  category: string;
  title: string;
  text: string;
  hint: string;
  options: Option[];
  requiresState?: { key: keyof GameState; value: any };
  type?: 'single' | 'multiple';
  multiScoreChange?: number;
  multiFeedbackTitle?: string;
  multiFeedbackText?: string;
}

export interface Quiz {
  id: string;
  question: string;
  options: { text: string; isCorrect: boolean }[];
  feedbackCorrect: string;
  feedbackIncorrect: string;
}

