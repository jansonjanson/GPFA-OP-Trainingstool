export type DiagnoseTab = 'ds1_theorie' | 'ds2_simulation' | 'nuggets';

export interface SixFItem {
  id: string;
  term: 'Fat' | 'Female' | 'Fertile' | 'Forty' | 'Fair' | 'Family';
  germanDescription: string;
  explanation: string;
}

export interface Hotspot {
  id: string;
  title: string;
  bodyPart: string;
  xPercent: number; // For interactive SVG/Canvas positioning
  yPercent: number;
  symptomName: string;
  description: string;
  clinicalNote: string;
}

export interface ExcretionChoice {
  id: string;
  type: 'urin' | 'stuhl';
  label: string;
  colorName: string;
  colorClass: string;
  isCorrect: boolean;
  explanation: string;
}

export interface RedFlagCard {
  id: string;
  scenario: string;
  isEmergency: boolean; // true = Notfall, false = Normal/harmlos
  category: string;
  explanation: string;
}

export interface PfaActionItem {
  id: string;
  actionText: string;
  isCorrect: boolean;
  explanation: string;
}

export interface AnamneseChoice {
  id: string;
  question: string;
  category: 'optimal' | 'unnoetig' | 'irrelevant';
  patientAnswer: string;
  clinicalSignificance: string;
  diagnosticPoints: number;
  revealsRedFlag?: boolean;
}

export interface AnamneseStep {
  id: string;
  phaseTitle: string;
  stepNumber: number;
  situation: string;
  instruction: string;
  choices: AnamneseChoice[];
}
