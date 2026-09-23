export interface Vitals {
  hr: number | string;
  bp: string;
  spo2: number | string;
  nrs: number | string;
  vig: string;
}

export interface Feedback {
  title: string;
  text: string;
  source: string;
}

export interface CategoryScores {
  fachwissen: number;
  voraussicht: number;
  zeitmanagement: number;
  patientenzentrierung: number;
}

export interface Choice {
  id: string;
  text: string;
  type: 'success' | 'warning' | 'danger';
  scoreChange: number; // Safety score
  energyChange?: number; // Stress/Energy level
  categoryImpact?: Partial<CategoryScores>;
  feedback: Feedback;
  next: string;
  requiredItems?: string[]; // Inventory item IDs required to see this choice
  forbiddenItems?: string[]; // Inventory item IDs that hide this choice
  setFlags?: string[]; // Flags to set when choice is picked (e.g. for creeping fails)
  requiredFlags?: string[]; // Condition: Only show if these flags are active
  forbiddenFlags?: string[]; // Condition: Hide if any of these flags are active
  action?: 'openRecord' | 'measure'; // Action to perform when choice is selected
}

export interface InventoryItemDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  isCorrect?: boolean;
}

export interface Scene {
  id: string;
  location: string;
  time: string;
  title: string;
  text: string | ((inventory: string[], flags: string[]) => string);
  quote?: string;
  updateVitals?: Partial<Vitals>;
  choices?: Choice[];
  isEnd?: boolean;
  sceneType?: 'standard' | 'inventory' | 'measurement' | 'isbar' | 'sbar_call' | 'isbar_puzzle';
  inventoryItems?: InventoryItemDef[];
  puzzleItems?: { id: string; text: string; correctIndex: number }[];
  timeLimit?: number; // in seconds
  timeoutPenalty?: number; // Score deduction if time runs out
}

export interface HistoryItem {
  sceneId: string;
  scene: string;
  text: string;
  type: 'success' | 'warning' | 'danger' | 'timeout' | 'system';
  feedback?: Feedback;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'positive' | 'negative' | 'neutral';
}

export interface GameStats {
  runs: number;
  bestScore: number;
  bestCategories: CategoryScores;
  unlockedAchievements: string[];
}

export interface SavedRun {
  id: string;
  date: string;
  score: number;
  energy: number;
  achievements: string[];
  history: HistoryItem[];
}

