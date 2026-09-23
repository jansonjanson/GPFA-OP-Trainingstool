export type Section = 'wissen' | 'videos' | 'auftrag' | 'simulator' | 'checkin' | 'intro';
export const sectionsOrder: Section[] = ['wissen', 'videos', 'auftrag', 'simulator', 'checkin'];

export interface GameState {
  consentMissing?: boolean;
  time?: number; // In minutes, starts at 0 (e.g. 06:30)
  nervousness?: number; // 0 to 100
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
}

export interface Scenario {
  id: number;
  category: string;
  title: string;
  text: string;
  hint: string;
  options: Option[];
  requiresState?: { key: keyof GameState; value: any };
}

export interface Quiz {
  id: string;
  question: string;
  options: { text: string; isCorrect: boolean }[];
  feedbackCorrect: string;
  feedbackIncorrect: string;
}
