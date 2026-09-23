export type DSLevel = 'ds1' | 'ds2' | 'simulation' | 'nuggets';

export interface BasketItem {
  id: string;
  text: string;
  target: 'furcht' | 'angst';
  explanation: string;
}

export interface MatchingPair {
  id: string;
  scenario: string;
  scenarioTitle?: string;
  term: string;
  explanation: string;
}

export interface ClozeItem {
  key: string;
  correct: string;
  options: string[];
}

export interface CascadeStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  details: string;
}

export interface SwipeCard {
  id: string;
  statement: string;
  isCorrect: boolean; // True = Wahr, False = Falsch
  explanation: string;
}

export interface CommunicationItem {
  id: string;
  text: string;
  type: 'action' | 'statement';
  category: 'do' | 'dont';
  explanation: string;
}

export interface MatrixItem {
  id: string;
  text: string;
  targetCategory: 'symptom' | 'info' | 'angehoerige';
  explanation: string;
}

export interface ErrorRadarItem {
  id: string;
  title: string;
  isError: boolean;
  explanation: string;
}

export interface NotfallkofferItem {
  id: string;
  category: 'Kommunikation' | 'Umgebung' | 'Körperlich' | 'Angehörige' | 'Ablenkung' | 'Prämedikation';
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  description: string;
  dos: string[];
  donts: string[];
  practicalTips: string;
  clinicalRationale: string;
}

export interface LearningNugget {
  id: string;
  ds: 1 | 2;
  title: string;
  subtitle: string;
  category: string;
  icon: string;
  unlockedByQuizId: string;
  slideType: 'angst_vs_furcht' | 'entstehungsformen' | 'physiologie' | 'angstkaskade' | 'kommunikation' | 'notfallkoffer';
  summary: string;
}

export interface SimChoice {
  id: string;
  text: string;
  nextSceneId: string;
  feedback: string;
  type: 'optimal' | 'acceptable' | 'critical';
  trustChange: number; // Patientensicherheit / Vertrauen
  stressChange: number; // Angst-Level
  vitalsEffect?: {
    hr?: number;
    bpSys?: number;
    bpDia?: number;
    resp?: number;
    sweat?: string;
  };
}

export interface SimScene {
  id: string;
  title: string;
  location: string;
  time: string;
  patientQuote: string;
  situationText: string;
  vitals: {
    hr: number;
    bpSys: number;
    bpDia: number;
    resp: number;
    sweat: 'Trocken' | 'Leicht feucht' | 'Stark klamm / schweißnass';
    pupils: 'Normal' | 'Leicht geweitet' | 'Stark geweitet (Mydriasis)';
  };
  recommendedKitAction?: string;
  choices: SimChoice[];
}
